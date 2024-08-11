import * as yup from 'yup';

export const expenseSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  amount: yup
    .number()
    .typeError('Amount must be a number')
    .positive('Amount must be greater than zero')
    .required('Amount is required'),
  date: yup
    .string()
    .matches(
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
      'Date must be in the format DD/MM/YYYY',
    )
    .required('Date is required'),
});
