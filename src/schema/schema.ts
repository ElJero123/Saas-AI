import z from 'zod'

const RegisterSchema = z.object({
    name: z.string({
        invalid_type_error: 'Username must be a string'
    }).min(3).max(75),
    password: z.string({
        invalid_type_error: 'Password must be a string'
    }).min(8),
    email: z.string({
        invalid_type_error: 'Email must be a string'
    }).email('Invalid email format')
})

const LoginSchema = z.object({ 
    password: z.string({
        invalid_type_error: 'Password must be a string'
    }).min(8),
    email: z.string({
        invalid_type_error: 'Email must be a string'
    }).email('Invalid email format')
})

const MessageSchema = z.object({
    message: z.string({
        invalid_type_error: 'Message must be a string'
    }).min(2, 'Message too short')
})

const SubscriptionSchema = z.object({
    subId: z.string({
        invalid_type_error: 'Subscription ID must be a string'
    }).min(1, 'Subscription ID is required'),
    cancelAt: z.string({
        invalid_type_error: 'Cancel at must be a string'
    }).min(1, 'Cancel at is required'),
    userId: z.string({
        invalid_type_error: 'User ID must be a string'
    }).min(1, 'User ID is required'),
    customerId: z.string({
        invalid_type_error: 'Customer ID must be a string'
    }).min(1, 'User ID is required'),
    cancelAtPeriodEnd: z.boolean({
        invalid_type_error: 'Cancel at period end must be a boolean'
    })
})

export const validateUser = (data: unknown) => {
    return RegisterSchema.safeParseAsync(data)
}

export const validateLoginUser = (data: unknown) => {
    return LoginSchema.safeParseAsync(data)
}

export const validateMessage = (data: unknown) => {
    return MessageSchema.safeParseAsync(data)
}

export const validateSubscription = (data: unknown) => {
    return SubscriptionSchema.safeParseAsync(data)
}