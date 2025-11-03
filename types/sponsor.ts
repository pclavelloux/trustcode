export interface Sponsor {
  id: string
  email: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  website_url: string | null
  company_name: string | null
  description: string | null
  status: 'pending' | 'active' | 'cancelled' | 'expired'
  payment_date: string | null
  expires_at: string | null
  created_at: string
  updated_at: string
}

