# Manual Test Script: Referral Bonus Program (Ticket #484)

## Scenario 1: Qualified Sign-Up (Free Referrer)
1. Log in as a Free user and copy the referral link.
2. Open a new incognito window and sign up using the referral link.
3. Verify that the referrer's `extraPostsQuota` has NOT increased yet.
4. As the referred user, link a social media account (OAuth) in settings.
5. Verify that the referrer's `extraPostsQuota` increases by +1.

## Scenario 2: Lifetime License Referrer Reward
1. Log in as a Lifetime License user and copy the referral link.
2. Open a new incognito window and sign up using the referral link.
3. Upgrade the referred user to a Paid plan using the Stripe test card.
4. Verify that the referrer receives +1,000 AI Credits.

## Scenario 3: Paid Referrer Reward
1. Log in as a Paid user and copy the referral link.
2. Open a new incognito window and sign up using the referral link.
3. Upgrade the referred user to a Paid plan using the Stripe test card.
4. Verify in the Stripe dashboard that the referrer's customer account received a $10 credit.
