import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {setUser} from '../redux/slices/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../global/styles/colors';

const WelcomeScreen = ({navigation}: any) => {
  const [fullName, setFullNameState] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const checkUser = async () => {
      const storedName = await AsyncStorage.getItem('fullName');
      if (storedName) {
        dispatch(setUser(storedName));
        navigation.replace('MainTabs');
      }
    };
    checkUser();
  }, [dispatch, navigation]);

  const handleSubmit = async () => {
    if (fullName.trim()) {
      await AsyncStorage.setItem('fullName', fullName);
      dispatch(setUser(fullName));
      navigation.replace('MainTabs');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome! Please enter your name:</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullNameState}
      />
      <Button title="Submit" onPress={handleSubmit} color={colors.primary} />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  input: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    width: '80%',
    marginVertical: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});

export default WelcomeScreen;
