# The cart ends in a WhatsApp order request, not a payment

**Status**: accepted

The site modelled a full checkout — a lock icon, "Checkout with Express Dispatch", a
generated rider ticket — with no payment integration and no stock behind it. On a real
business that is the fastest way to lose trust. The cart, the drawer and the free-shipping
threshold stay; the final step becomes an order request that hands off to WhatsApp for a
human to confirm. This is how most small Dhaka roasters actually trade, and it keeps the
site dependency-free.

**Considered Options**: real checkout (needs payment rails, inventory and order state — a
platform decision, not a website decision); enquiry-only with no cart (throws away the
strongest interaction on the site).
