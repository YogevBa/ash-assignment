import React, {useEffect, useState} from 'react';
import {View, Text, SectionList, TextInput, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {
  deleteExpense,
  selectExpenses,
  setExpenses,
} from '../redux/slices/expensesSlice';
import {selectUser} from '../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../global/styles/colors';
import CustomButton from '../components/CustomButton';

interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
}

interface Section {
  title: string;
  data: Expense[];
}

const HomeScreen = ({navigation}: any) => {
  const expenses = useSelector(selectExpenses);
  const fullName = useSelector(selectUser);
  const dispatch = useDispatch();

  const [filteredExpenses, setFilteredExpenses] = useState<Section[]>([]);
  const [filter, setFilter] = useState({title: '', amount: '', date: ''});

  useEffect(() => {
    navigation.setOptions({
      title: `Welcome, ${fullName}`,
    });
  }, [navigation, fullName]);

  useEffect(() => {
    const loadExpenses = async () => {
      const storedExpensesRaw = await AsyncStorage.getItem('expenses');
      const storedExpenses: Expense[] = storedExpensesRaw
        ? JSON.parse(storedExpensesRaw)
        : [];
      dispatch(setExpenses(storedExpenses));
    };

    loadExpenses();
  }, [dispatch]);

  useEffect(() => {
    const sortedExpenses = [...expenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const groupedExpenses = sortedExpenses.reduce((sections, expense) => {
      const date = expense.date;
      const section = sections.find(section => section.title === date);

      if (section) {
        section.data.push(expense);
      } else {
        sections.push({title: date, data: [expense]});
      }

      return sections;
    }, [] as Section[]);

    setFilteredExpenses(groupedExpenses);
  }, [expenses]);

  const handleFilter = () => {
    const filtered = expenses.filter(expense => {
      const matchesTitle = filter.title
        ? expense.title.includes(filter.title)
        : true;
      const matchesAmount = filter.amount
        ? expense.amount === parseFloat(filter.amount)
        : true;
      const matchesDate = filter.date ? expense.date === filter.date : true;

      return matchesTitle && matchesAmount && matchesDate;
    });

    const sortedFilteredExpenses = [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const groupedFilteredExpenses = sortedFilteredExpenses.reduce(
      (sections, expense) => {
        const date = expense.date;
        const section = sections.find(section => section.title === date);

        if (section) {
          section.data.push(expense);
        } else {
          sections.push({title: date, data: [expense]});
        }

        return sections;
      },
      [] as Section[],
    );

    setFilteredExpenses(groupedFilteredExpenses);
  };

  const handleDeleteExpense = async (id: string) => {
    dispatch(deleteExpense(id));

    const storedExpensesRaw = await AsyncStorage.getItem('expenses');
    const storedExpenses: Expense[] = storedExpensesRaw
      ? JSON.parse(storedExpensesRaw)
      : [];

    const updatedExpenses = storedExpenses.filter(expense => expense.id !== id);

    await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
  };

  return (
    <View style={styles.container}>
      {/* Filtering UI */}
      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Filter by title"
          value={filter.title}
          onChangeText={text => setFilter({...filter, title: text})}
          style={styles.input}
        />
        <TextInput
          placeholder="Filter by amount"
          value={filter.amount}
          onChangeText={text => setFilter({...filter, amount: text})}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          placeholder="Filter by date (YYYY-MM-DD)"
          value={filter.date}
          onChangeText={text => setFilter({...filter, date: text})}
          style={styles.input}
        />
        <CustomButton title="Apply Filters" onPress={handleFilter} />
        <CustomButton
          title="Clear Filters"
          onPress={() => setFilter({title: '', amount: '', date: ''})}
        />
      </View>

      <SectionList
        sections={filteredExpenses}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.itemAmount}>{`$${item.amount.toFixed(
              2,
            )}`}</Text>
            <Text style={styles.itemDate}>{item.date}</Text>
            <CustomButton
              title="Delete Expense"
              onPress={() => handleDeleteExpense(item.id)}
              style={{backgroundColor: colors.secondary}}
            />
          </View>
        )}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
      />
      <CustomButton
        title="Add Expense"
        onPress={() => navigation.navigate('CreateEditExpense')}
        style={{backgroundColor: colors.primary}}
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
  filterContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.textPrimary,
  },
  itemAmount: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 5,
  },
  itemDate: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: colors.primary,
  },
});

export default HomeScreen;
