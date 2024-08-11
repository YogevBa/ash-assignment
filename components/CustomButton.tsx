import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import colors from '../global/styles/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: object;
}

const CustomButton = ({title, onPress, style}: ButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
