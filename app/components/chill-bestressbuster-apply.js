import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, Platform, ScrollView, StyleSheet, Text, TouchableHighlight, View, TextInput } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import lodash from 'lodash';
import sc from '../../config/styles';
import * as chillBeStressbusterActions from '../actions/chill-bestressbuster-actions';
import SignView from '../components/sign-view';

const propTypes = {};

const ChillBeStressbusterApply = ({ questions, isSignedUp, bottomInset, chillBeStressbusterActions }) => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({defaultValue: { fullName: '', preferredName: '', email: '', password: ''}});
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onSubmit = (data) => {
    chillBeStressbusterActions.signup(data);
  };

  const keyboardWillShow = (e) => {
    setKeyboardHeight(e.endCoordinates.height);
    chillBeStressbusterActions.updateBottomInset(e.endCoordinates.height);
  };

  const keyboardWillHide = () => {
    setKeyboardHeight(0);
    chillBeStressbusterActions.updateBottomInset(0);
  };

  useEffect(() => {
    const action = Platform.OS === 'ios' ? 'Will' : 'Did';
    Keyboard.addListener(`keyboard${action}Show`, keyboardWillShow);
    Keyboard.addListener(`keyboard${action}Hide`, keyboardWillHide);

    return () => {
      // Keyboard.removeListener(`keyboard${action}Show`, keyboardWillShow);
      // Keyboard.removeListener(`keyboard${action}Hide`, keyboardWillHide);
    };
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
      padding: 20,
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

  return (
    <View style={styles.container}>
      {isSignedUp && <SignView message="Thanks for signing up!" />}

      {!isSignedUp && (
        <ScrollView
          style={styles.scrollContainer}
          automaticallyAdjustContentInsets={false}
          contentInset={{ bottom: bottomInset }}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
        >
          <Controller
            name="fullName"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                // style={fieldStylesheet.textbox.normal}
                placeholder="Your Full Name"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.fullName && <Text style={styles.textError}>This is required.</Text>}

          <Controller
            name="preferredName"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                // style={fieldStylesheet.textbox.normal}
                placeholder="Preferred Name"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.preferredName && <Text style={styles.textError}>This is required.</Text>}
          
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                // style={fieldStylesheet.textbox.normal}
                placeholder="Email"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && <Text style={styles.textError}>This is required.</Text>}

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                // style={fieldStylesheet.textbox.normal}
                placeholder="Password"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && <Text style={styles.textError}>This is required.</Text>}

          <Controller
            name="phone"
            control={control}
            defaultValue=""
            render={({ field: { onChange, value } }) => (
              <TextInput
                // style={fieldStylesheet.textbox.normal}
                placeholder="Phone number"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {/* Add other form fields similarly */}

          <TouchableHighlight
            style={styles.button}
            underlayColor="#99d9f4"
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
        </ScrollView>
      )}
    </View>
  );
};

ChillBeStressbusterApply.propTypes = propTypes;

const mapStateToProps = (state) => ({
  bottomInset: state.chillBeStressbuster.bottomInset,
  questions: state.chillBeStressbuster.questions,
  isSignedUp: state.chillBeStressbuster.isSignedUp,
});

const mapDispatchToProps = (dispatch) => ({
  chillBeStressbusterActions: bindActionCreators(chillBeStressbusterActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChillBeStressbusterApply);
