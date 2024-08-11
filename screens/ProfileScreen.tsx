import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {clearUser} from '../redux/slices/userSlice';
import {setExpenses} from '../redux/slices/expensesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../global/styles/colors';

const ProfileScreen = ({navigation}: any) => {
  const fullName = useSelector((state: any) => state.user.fullName);
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    await AsyncStorage.clear();
    dispatch(clearUser());
    dispatch(setExpenses([]));
    navigation.replace('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.profileText}>Profile: {fullName}</Text>
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        color={colors.deleteColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  profileText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
});

export default ProfileScreen;
