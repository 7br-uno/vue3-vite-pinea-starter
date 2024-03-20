export const auth = {
  name: [(v) => !!v || 'messages.name_is_required'],
  email: [
    (v) => !!v || 'messages.e_mail_is_required',
    (v) => /.+@.+/.test(v) || 'messages.not_a_valid_email',
  ],
  password: [
    (v) => !!v || 'messages.password_is_required',
    (v) =>
      v.length >= 8 || 'messages.password_must_contain_at_least_8_characters',
  ],
  passwordUpdate: [
    (v) =>
      v.length >= 8 || 'messages.password_must_contain_at_least_8_characters',
  ],
}

export const testRule = async (rule, valueToValidate) => {
  let errors = []
  for (let i = 0; i < rule.length; i++) {
    if (rule[i](valueToValidate) !== true) {
      errors.push(rule[i](valueToValidate))
    }
  }
  return errors
}
