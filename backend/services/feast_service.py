from typing import List
from feast import FeatureStore
from models import Product, User
import os
from minio import Minio
import torch
import json
import shutil
from public.models.entity_tower import EntityTower
from public.models.data_util import data_preproccess
from public.service.dataset_provider import LocalDatasetProvider
from datetime import datetime, timezone
import pandas as pd

class FeastService:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(FeastService, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if not self._initialized:
            self.store = FeatureStore('public')
            self._initialized = True
            self.user_encoder = self._load_user_encoder()
            self.user_service = self.store.get_feature_service("user_service")
            self.dataset_provider = LocalDatasetProvider(self.store, data_dir='public/data')

    def _load_model_version(self):
        from sqlalchemy import text
        from sqlalchemy import create_engine

        database_url = os.getenv('DATABASE_URL')
        engine = create_engine(database_url)

        with engine.connect() as connection:
            result = connection.execute(text("SELECT version FROM model_version ORDER BY updated_at DESC LIMIT 1"))
            version = result.fetchone()[0]
            return version

    def _load_user_encoder(self):
        minio_client = Minio(
            endpoint=os.getenv('MINIO_HOST', "endpoint") + ':' + os.getenv('MINIO_PORT', '9000'),
            access_key=os.getenv('MINIO_ACCESS_KEY', "access-key"),
            secret_key=os.getenv('MINIO_SECRET_KEY', "secret-key"),
            secure=False
        )
        model_version = self._load_model_version()
        bucket_name = "user-encoder"
        object_name = f"user-encoder-{model_version}.pth"
        configuration = f'user-encoder-config-{model_version}.json'

        minio_client.fget_object(bucket_name, object_name, "/tmp/user-encoder.pth")
        minio_client.fget_object(bucket_name, configuration, "/tmp/user-encoder-config.json")

        with open('/tmp/user-encoder-config.json', 'r') as f:
            json_config = json.load(f)
        user_encoder = EntityTower(json_config['users_num_numerical'], json_config['users_num_categorical'])
        user_encoder.load_state_dict(torch.load('/tmp/user-encoder.pth'))

        return user_encoder

    def get_all_existing_users(self) -> List[dict]:
        try:
            user_df = self.dataset_provider.user_df()
            print("Fetched all users")
            return user_df
        except Exception as e:
            print(f"Failed to fetch users from feature view: {e}")
            return []

    def load_items_existing_user(self, user_id: str) -> List[Product]:
        suggested_item_ids = self.store.get_online_features(
            features=self.store.get_feature_service('user_top_k_items'),
            entity_rows=[{'user_id': user_id}]
        )
        top_item_ids = suggested_item_ids.to_df().iloc[0]['top_k_item_ids']
        return self._item_ids_to_product_list(top_item_ids)

    def load_items_new_user(self, user: User, k: int = 10):
        user_as_df = pd.DataFrame([user.model_dump()])
        user_embed = self.user_encoder(**data_preproccess(user_as_df))[0]
        top_k = self.store.retrieve_online_documents(
            query=user_embed.tolist(),
            top_k=k,
            features=['item_embedding:item_id']
        )
        top_item_ids = top_k.to_df().iloc[0]['top_k_item_ids']
        return self._item_ids_to_product_list(top_item_ids)

    def _item_ids_to_product_list(self, top_item_ids: pd.Series | List) -> List[Product]:
        suggested_item = self.store.get_online_features(
            features=self.store.get_feature_service('item_service'),
            entity_rows=[{'item_id': item_id} for item_id in top_item_ids]
        ).to_df()
        print(suggested_item.columns)
        print(suggested_item)
        suggested_item = [Product(
        item_id=row.item_id,
        product_name=row.product_name,
        category=row.category,
        about_product=getattr(row, "about_product", None),
        img_link=getattr(row, "img_link", None),
        discount_percentage=getattr(row, "discount_percentage", None),
        discounted_price=getattr(row, "discounted_price", None),
        actual_price=row.actual_price,
        product_link=getattr(row, "product_link", None),
        rating_count=getattr(row, "rating_count", None),
        rating=getattr(row, "rating", None),
        ) for row in suggested_item.itertuples()]
        return suggested_item

# Initialize the service
feast_service = FeastService()
