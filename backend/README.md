# Backend for Product Recommendation System Kickstart

This is the backend for the product recommendation system. The best way to deploy it is with the entire cluster by following the `README.md` of Kickstart.

Once you deployed it in your cluster, you can use the portforward it if you want using:
```
oc port-forward svc/product-recommender-system-backend -n <NAMESPACE> 8000:8000
```
