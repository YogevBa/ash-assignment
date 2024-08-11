import React from 'react';
import {View, TextInput, Text, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch} from 'react-redux';
import {addExpense, editExpense} from '../redux/slices/expensesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import CustomButton from '../components/CustomButton';
import colors from '../global/styles/colors';
import {expenseSchema} from '../global/validations/formValidationSchema';

interface ExpenseFormData {
  title: string;
  amount: string;
  date: string;
}

const CreateEditExpense = ({route, navigation}: any) => {
  const {expense} = route.params || {};
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ExpenseFormData>({
    resolver: yupResolver(expenseSchema),
    defaultValues: {
      title: expense?.title || '',
      amount: expense?.amount?.toString() || '',
      date: expense?.date || '',
    },
  });

  const onSubmit = async (data: ExpenseFormData) => {
    const newExpense = {
      id: expense?.id || uuid.v4(),
      title: data.title,
      amount: parseFloat(data.amount),
      date: data.date,
    };

    if (expense && expense.id) {
      dispatch(editExpense(newExpense));
    } else {
      dispatch(addExpense(newExpense));
    }

    const storedExpensesRaw = await AsyncStorage.getItem('expenses');
    const storedExpenses = storedExpensesRaw
      ? JSON.parse(storedExpensesRaw)
      : [];

    const updatedExpenses = expense?.id
      ? storedExpenses.map((exp: any) =>
          exp.id === expense.id ? newExpense : exp,
        )
      : [...storedExpenses, newExpense];

    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Title"
              value={value}
              onChangeText={onChange}
              style={[
                styles.input,
                errors.title && {borderColor: colors.deleteColor},
              ]}
            />
            {errors.title && (
              <Text style={styles.errorText}>{errors.title.message}</Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="amount"
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Amount"
              value={value}
              onChangeText={onChange}
              keyboardType="numeric"
              style={[
                styles.input,
                errors.amount && {borderColor: colors.deleteColor},
              ]}
            />
            {errors.amount && (
              <Text style={styles.errorText}>{errors.amount.message}</Text>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="date"
        render={({field: {onChange, value}}) => (
          <>
            <TextInput
              placeholder="Date (DD-MM-YYYY)"
              value={value}
              onChangeText={onChange}
              style={[
                styles.input,
                errors.date && {borderColor: colors.deleteColor},
              ]}
            />
            {errors.date && (
              <Text style={styles.errorText}>{errors.date.message}</Text>
            )}
          </>
        )}
      />
      <CustomButton
        title={expense ? 'Save' : 'Create'}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  errorText: {
    color: colors.deleteColor,
    marginBottom: 10,
  },
});

export default CreateEditExpense;
