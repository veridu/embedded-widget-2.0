export default {
    header: {
        title: {
            default: 'Please verify here',
            more_sources_needed: 'More information needed',
            loading: 'Analysing data...',
            verified: 'Identity verified',
            introduction: `You're almost there`,
            failed: 'Identity not verified'
        },
        subtitle: {
            default: 'Sign in below to verify your identity',
            more_sources_needed: 'Click another option below',
            loading: 'You can click another option below'
        }
    },
    footer: {
        terms_and_conditions: 'I accept the <br> terms of use'
    },
    finish: {
        success: 'Thank you',
        fail: `This identity could not be verified`
    },
    provider: {
        loading: '{0} is being loaded...'
    },
    button: {
        email: {
            disabled: {
                'no-token': 'You need to add a Social Provider before adding the Email verification'
            }
        }
    },
    source: {
        email: {
            form: {
                email: {
                    placeholder: 'Email',
                },
                "verification-code": {
                    placeholder: 'Verification Code'
                }
            },
            title: {
                default: 'Email Verification',
                verified: 'Code verified successfully'
            },
            action: {
                send: 'SEND CODE',
                verify: 'VERIFY CODE'
            }
        }
    },
    general: {
        introduction: 'Further identification needed to complete your transaction', // introduction text
        continue: 'continue', // continue to next step (from introduction)
        more: 'More', // more providers
        logout: 'logout',
        cancel: 'CANCEL',
        loading: {
            default: 'loading',
            dots: 'loading...'
        }
    }
};
