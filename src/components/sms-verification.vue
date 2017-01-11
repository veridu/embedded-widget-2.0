<style lang="scss" scoped>
    @import "../sass/variables";
    @import "../sass/functions";
    @import "../../node_modules/bootstrap-sass/assets/stylesheets/bootstrap/mixins";

    .sms-verification {
        display: flex;
        background-color: #f1f1f1;
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 100;
        justify-content: center;
        align-items: center;
        color: #555;
        animation-name: VeriduEmbeddedWidgetSmsVerification;
        animation-duration: 0.25s;
        animation-timing-function: ease-out;
        border: 1px solid #ccc;
        border-radius: 3px;

        @keyframes VeriduEmbeddedWidgetSmsVerification {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
            }
        }

        strong {
            display: block;
            color: inherit;
            margin-bottom: 0.8em;
        }

        .sms-verification__content {
            max-width: 80%;
        }

        .input-container {
            display: flex;
            flex-direction: column;

            &:not(:last-of-type) {
                margin-bottom: 1em;
            }

            input {
                width: 100%;
                border-bottom: 1px solid $brand-primary;

                &:disabled {
                    border-color: #ccc;
                }
            }
        }

        .text-right {
            text-align: right
        }

        button {
            padding: 10px;
            border: 0;
            outline: 0;
            background-color: transparent;
            border-radius: 3px;
            transition: background-color 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);

            &.action {
                color: $brand-primary;
            }

            &:hover {
                background-color: #eee;
            }
        }

        input[type='number'] {
            -moz-appearance:textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    }
</style>

<template>
    <div class="sms-verification" v-show="showSmsForm">
        <div class="sms-verification__content">
            <strong>{{ title }}</strong>

            <div class="input-container" v-show="! verified">
                <input type="sms" name="sms" v-model="sms" placeholder="{{ translate('source.sms.form.sms.placeholder') }}" autofocus :disabled="verificationSent">
            </div>
            <div class="input-container" v-show="verificationSent && ! verified">
                <input type="number" pattern="[0-9]*" inputmode="numeric" v-model.number="code" placeholder="{{ translate('source.sms.form.verification-code.placeholder') }}">
            </div>
            <div class="text-right" v-show="! verified">
                <button @click="close">
                    {{ translate('general.cancel') }}
                </button>
                <button class="action" @click="sendSms" v-show="! verificationSent">
                    {{ send }}
                </button>
                <button class="action" @click="sendCode" v-show="verificationSent">
                    {{ verify }}
                </button>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data() {
        return {
            sms: '',
            code: null,
            source: null,
            verified: false,
            verificationSent: false
        };
    },
    methods: {
        /**
         * Closes the E-mail verification component.
         */
        close(){
            this.showSmsForm = false;
            this.verificationSent = false;
            this.sms = '';
            this.code = null;
        },
        /**
         * Finishes the verification.
         */
        finish() {
            this.verified = true;

            setTimeout(() => {
                this.close();
                this.$root.providerAdded('sms');
            }, 2000);
        },
        /**
         * Sends a code to the API trying to validate.
         */
        sendCode() {
            const promise = this.$http.patch(`${this.$root.cfg.URL.API}profiles/_self/sources/${this.source.id}`, {
                tags: {
                    'otp_code': +this.code
                }
            }, {
                headers : {
                    'Authorization': `UserToken ${this.$root.userToken}`
                }
            });

            promise.then(response => {
                const source = response.data.data;
                if (source.tags.otp_verified) {
                    this.finish();
                }
            });

            // too many tries
            promise.catch(response => {
                window.alert('You have exceeded the number of tries. \nStart another SMS verification process');
                this.code = null;
                this.verificationSent = false;
            });
        },
        /**
         * Sends the OTP sms to the e-mail given.
         */
        sendSms() {
            this.verificationSent = true;
            const promise = this.$http.post(`${this.$root.cfg.URL.API}profiles/_self/sources`, {
                name: 'sms-otp',
                tags: {
                    'phone': this.sms,
                    'otp_check': true
                }
            }, {
                headers : {
                    'Authorization': `UserToken ${this.$root.userToken}`
                }
            });

            promise.then(response => {
                this.source = response.data.data;
            });
        }
    },
    props: [ 'showSmsForm' ],
    computed: {
        title() {
            return this.verified ? this.translate('source.sms.title.verified') : this.translate('source.sms.title.default');
        },
        send() {
            return this.translate('source.sms.action.send');
        },
        verify() {
            return this.translate('source.sms.action.verify');
        },
    },
    components: {
    },
    created() {
    }
}
</script>
