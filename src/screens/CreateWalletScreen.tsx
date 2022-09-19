import React, {useEffect, useState} from 'react';
import {Button, Image, Linking, Text, View} from 'react-native';
import {Title} from 'react-native-paper';
import {CompositeScreenProps} from "@react-navigation/core/src/types";
import FormButton from '../components/FormButton';
import FormInput from '../components/FormInput';
import Loading from '../components/Loading'

import {displayOrHide, styles} from "../styles/styles";

export default function CreateWalletScreen({route, navigation}: CompositeScreenProps<any, any>) {
    const [initialized, setInitialized] = useState<boolean>(false);
    const [loading, setLoading] = useState(false);
    const [mnemonic, setMnemonic] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [createWalletButton, setCreateWalletButton] = useState<JSX.Element>(<Text/>);
    const [problemText, setProblemText] = useState<string>("")
    const [problem, setProblem] = useState<JSX.Element>(<Text/>)
    const [passwordsMatch, setPasswordsMatch] = useState<JSX.Element>(<Text/>)
    const [passwordAlpha, setPasswordAlpha] = useState<JSX.Element>(<Text/>)
    const [passwordNumeric, setPasswordNumeric] = useState<JSX.Element>(<Text/>)
    const [passwordAlphaNumericOnly, setPasswordAlphaNumericOnly] = useState<JSX.Element>(<Text/>)
    const [passwordLongEnough, setPasswordLongEnough] = useState<JSX.Element>(<Text/>)
    const [userName, setUserName] = useState<string>('');
    const [userNameValid, setUserNameValid] = useState<JSX.Element>(<Text/>)
    const [walletName, setWalletName] = useState<string>("RootsWalletName_"+ Date.now());
    const [walletNameValid, setWalletNameValid] = useState<JSX.Element>(<Text/>)

    console.log("CreateWalletScreen - start")

    useEffect(() => {
        setLoading(true)
        checkErrors();
        setLoading(false)
    }, []);

    useEffect(() => {
        checkErrors()
    }, [userName, walletName, password, confirmPassword, problemText]);

    function checkErrors() {
        const passNumeric = (/\d/.test(password))
        console.warn("CreateWalletScreen - password must contain numbers",passNumeric)
        setPasswordNumeric(<Text style={displayOrHide(!passNumeric,styles.problem)}>Password must contain
            numbers</Text>)

        const prob = problemText && problemText.length > 0
        console.warn("CreateWalletScreen - problem detected", problemText)
        setProblem(<Text style={displayOrHide(prob,styles.problem)}>{problemText}</Text>)

        const passAlpha = (/[a-zA-Z]/.test(password))
        console.log("password must contain letters",passAlpha)
        setPasswordAlpha(<Text style={displayOrHide(!passAlpha,styles.problem)}>Password must contain letters</Text>)

        const passAlphaNumOnly = (/^[\da-zA-Z]+$/).test(password)
        console.log("password can only contain numbers and letters",passAlphaNumOnly)
        setPasswordAlphaNumericOnly(<Text style={displayOrHide(!passAlphaNumOnly,styles.problem)}>Password can only contain numbers and letters</Text>)

        const passLength = password.length >= 8
        console.log("password not long enough", passLength)
        setPasswordLongEnough(<Text style={displayOrHide(!passLength,styles.problem)}>Password must be at least 8
            characters</Text>)

        const passMatch = (password === confirmPassword)
        console.log("passwords must match", password, confirmPassword);
        setPasswordsMatch(<Text style={displayOrHide(!passMatch,styles.problem)}>Passwords must match</Text>)

        const userValid = (userName && userName.length > 0)
        console.log("user name must be set", userName);
        setUserNameValid(<Text style={displayOrHide(!userValid,styles.problem)}>User name must be set</Text>)

        const walletValid = (walletName && walletName.length > 0)
        console.log("wallet name must be set", walletName);
        setWalletNameValid(<Text style={displayOrHide(!walletValid,styles.problem)}>Wallet name must be set</Text>)

        if (walletValid && userValid && passNumeric && passAlpha &&
            passLength && passMatch && passAlphaNumOnly) {
            setCreateWalletButton(<FormButton
                disabled={!(walletValid && userValid && passwordsMatch &&
                    passwordAlpha && passwordNumeric && passwordAlphaNumericOnly &&
                    passwordLongEnough && passAlphaNumOnly)}
                title="Create Wallet"
                modeValue="contained"
                labelStyle={styles.loginButtonLabel}
                onPress={async () => {
                    console.log("creating wallet", walletName, mnemonic, password)
                    try {


                            console.log("CreateWalletScreen - Wallet created")
                            const walName = "Wallet Name"
                                console.log("CreateWalletScreen - Got wallet name, setting to initialized")
                                setInitialized(true)
                                setProblemText("")
                                console.log("CreateWalletScreen - signing in")
                            navigation.navigate("Login")

                    } catch (error: any) {
                        console.error("CreateWalletScreen - Creating wallet failed", error, error.stack)
                        setProblemText(error.message)
                    }
                }}
            />)
        } else {
            setCreateWalletButton(<Text/>)
        }
    }

    function handleOpenWithLinking() {
        Linking.openURL('https://www.rootsid.com/projects/rootswallet/help');
    }

    function handleSettings() {
        console.log("handling settings")
        navigation.navigate("Settings")
    }

    if (loading) {
        return (<Loading/>)
    }

    return (
        <View style={styles.centeredContainer}>
            <Image
                style={{ width: 150, height: 150 }}
                source={{uri: "https://github.com/roots-id/rootswallet/raw/main/src/assets/LogoOnlyGlow512.png"}}
            />
            <Title style={styles.titleText}>Create wallet password:</Title>
            <FormInput
                labelName="User Name"
                onChangeText={(uName: React.SetStateAction<string>) => setUserName(uName)}
                placeholder={"Set user name"}
                secureTextEntry={false}
                value={userName}
            />
            <FormInput
                labelName="Password"
                placeholder={"Enter Password"}
                value={password}
                secureTextEntry={true}
                onChangeText={(userPassword: React.SetStateAction<string>) => setPassword(userPassword)}
            />
            <FormInput
                labelName="Confirm Password"
                placeholder={"Confirm Password"}
                value={confirmPassword}
                secureTextEntry={true}
                onChangeText={(userPassword: React.SetStateAction<string>) => setConfirmPassword(userPassword)}
            />
            {walletNameValid}
            {userNameValid}
            {passwordAlphaNumericOnly}
            {passwordAlpha}
            {passwordNumeric}
            {passwordLongEnough}
            {passwordsMatch}
            {problem}
            {createWalletButton}
            <Text></Text>
            <View style={{
                backgroundColor: '#251520', flex: 1, flexDirection: "row",
                justifyContent: 'space-between', marginBottom: 10, width: '90%',
                maxWidth: 400,
            }}>
                <View style={{flex: 1, marginRight: 10, marginLeft: 10}}>
                    <Button
                        title="Need Help?"
                        onPress={handleOpenWithLinking}
                        color={'#251520'}
                    />
                </View>
                <View style={{backgroundColor: '#251520', flex: 1, marginLeft: 5, marginRight: 10}}>
                    <Button
                        title="Settings"
                        onPress={handleSettings}
                        color={'#251520'}
                    />
                </View>
            </View>
        </View>
    );
}
