import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import sc from '../../config/styles';
import { useDispatch } from 'react-redux';
import * as chillAmStressbusterActions from '../actions/chill-amstressbuster-actions';
import { TextInput } from 'react-native-gesture-handler';

const ChillAmStressbusterLoginForm = () => {

  const dispatch = useDispatch();
  const { control, handleSubmit, errors } = useForm({defaultValues:{ email:'', password:''}});

  const onSubmit = (data) => {
    dispatch(chillAmStressbusterActions.login(data));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
        <Controller
          control={control}
          render={( {field: { onChange, onBlur, value }}) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          name="email"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.email && <Text style={styles.textError}>Email is required.</Text>}

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value }}) => (
            <TextInput
              style={styles.input}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              placeholder="Password"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
          name="password"
          rules={{ required: true }}
          defaultValue=""
        />
        {errors?.password && <Text style={styles.textError}>Password is required.</Text>}

        <TouchableHighlight
          style={styles.button}
          underlayColor="#99d9f4"
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Log me in</Text>
        </TouchableHighlight>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    ...sc.textBold,
    alignSelf: 'center',
  },
  button: {
    height: 48,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
    marginTop: 10,
  },
  textError: {
		...sc.textFormContent,
    color: '#993031',
  },
});

export default ChillAmStressbusterLoginForm;
