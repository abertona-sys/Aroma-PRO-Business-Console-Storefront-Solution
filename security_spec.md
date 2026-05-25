# Security Spec

## Data Invariants
1. Products can only be created/updated by the admin.
2. Products must have a valid price (>= 0), name, and category.
3. Materials can only be accessed by the admin.
4. Orders can be created by anyone (anonymous or unauthenticated) for the public catalog functionality, but once created, only the admin can read or update them (to prevent PII leakage of customer data).
5. Orders must contain valid item arrays and customer details.

## The "Dirty Dozen" Payloads
1. Create product as non-admin.
2. Update product price as non-admin.
3. Read materials as non-admin.
4. Create material as non-admin.
5. Create order with negative total.
6. Create order missing customer phone.
7. Read someone else's order.
8. Admin update order status to invalid enum.
9. Inject ghost field during product creation.
10. Inject ghost field during order creation.
11. Update product and try to change its ID.
12. Create product with 1MB string name.

