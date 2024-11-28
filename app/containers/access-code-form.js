
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Hr from '../components/hr';
import sc from '../../config/styles';
import RNCommunications from 'react-native-communications';
import TextButton from '../components/buttons/text-button';
import * as accessCodeActions from '../actions/access-code-actions';

const RenderForm = (props) => {
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: '',
            code: ''
        }
    });
    const {planDetail, onHide, errorMessage, styles} = props

    const dispatch = useDispatch();
    const onSubmit = (value) => {
        // this.props.accessCodeActions.useCode(values.email, values.code);
        dispatch(accessCodeActions.useCode(value.email, value.code))
    };
    return (
        <View style={styles.containerBody}>
            {/* Login Form */}
            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                <Controller
                    control={control}
                    rules={{
                        required: 'Email is required',
                        pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Enter a valid email address'
                        }
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={{ ...styles.input, 
                                borderColor:'#234F82',
                                borderWidth: 2, 
                                borderRadius: 8,
                                marginHorizontal:'0.125%' }}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Email"
                            placeholderTextColor={'#234F82'}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                    )}
                    name="email"
                />
                {errors.email && <Text style={styles.textError}>{errors.email.message}</Text>}

                <Controller
                    control={control}
                    rules={{ required: 'Password is required' }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                        style={{ ...styles.input, 
                                borderColor:'#234F82',
                                borderWidth: 2, 
                                borderRadius: 8,
                                marginHorizontal:'0.125%' }}                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            placeholder="Password"
                            placeholderTextColor={'#234F82'}
                            autoCapitalize="none"
                            autoCorrect={false}
                            secureTextEntry
                        />
                    )}
                    name="code"
                />
                {errors.code && <Text style={styles.textError}>{errors.code.message}</Text>}

                {errorMessage && (
                    <Text style={styles.textError}>
                        Sorry, invalid email or password.
                    </Text>
                )}

                <TextButton
                    text={'Login'}
                    textColor={sc.colors.white}
                    backgroundColor={'#234F82'}
                    onPress={handleSubmit(onSubmit)}
                />
                <Text style={styles.textExplainer}>
                    Use the password provided to you by your company, school, etc. You may receive occasional app news from The Stress Coach to the email address provided. More help: <Text
                        style={styles.textExplainerLink}
                        onPress={() => RNCommunications.email('info@thestresscoach.com')}
                    >
                        info@thestresscoach.com
                    </Text>
                </Text>
            </View>

            {/* Separator */}
            <View style={{ flex: 0, justifyContent: 'center' }}>
                <Hr
                    text={'OR'}
                    lineStyle={{
                        backgroundColor: "#dddddd",
                        height: 2,
                    }}
                    textStyle={{
                        color: sc.colors.black,
                        fontSize: 18,
                        fontFamily: sc.fontFamily.bold,
                    }}
                />
            </View>

            {/* Subscribe Section */}
            <View style={{ flex: 0.5, justifyContent: 'center' }}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => props.onPressSubscriptionInfoShow('monthly')}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.textButton}>{planDetail.monthly.title}</Text>
                        <View style={{ position: 'absolute', right: '1%', flex: 0, height: '50%' }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => props.onPressSubscriptionInfoShow('monthly')}
                            >
                                <Image
                                    style={{ height: '100%', resizeMode: 'contain' }}
                                    source={require('../../images/chrome/question-32.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ height: sc.dimension.hp(2) }} />

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => props.onPressSubscriptionInfoShow('annually')}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.textButton}>{planDetail.annually.title}</Text>
                        <View style={{ position: 'absolute', right: '1%', flex: 0, height: '50%' }}>
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => props.onPressSubscriptionInfoShow('annually')}
                            >
                                <Image
                                    style={{ height: '100%', resizeMode: 'contain' }}
                                    source={require('../../images/chrome/question-32.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ height: sc.dimension.hp(2) }} />

                <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={onHide}
                >
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.textButton}>
                            Enjoy Free Version
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RenderForm;
