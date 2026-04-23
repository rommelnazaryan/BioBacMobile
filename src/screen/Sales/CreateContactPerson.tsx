import { View, StyleSheet, ScrollView, TouchableOpacity, Text,KeyboardAvoidingView } from 'react-native'
import React from 'react'
import { Colors } from '@/theme/Colors';
import CustomHeader from '@/navigation/Header';
import TextView from '@/component/view/TextView';
import { Controller } from 'react-hook-form';
import useSaleCreateContactPerson from '@/hooks/useSale/useCreateContactPerson';
import TextInput from '@/component/input/TextInput';
import Calender from '@/component/calender';
import moment from 'moment';
import TouchableView from '@/component/view/TouchableView';
import DateIcon from '@/component/icons/DateIcon';
import Botton from '@/component/button';
import { AntDesign } from '@/component/icons/VectorIcon';
import DropdownComponent from '@/component/dropdown';

export default function CreateContactPerson() {

    const { control,
        handleSubmit,
        errors,
        onOpenDate,
        onclearDate,
        onCloseDate,
        date,
        showDate,
        onConfirmDate,
        onCreateContactPerson,
        selectedBuyerSeller,
        onSelectBuyerSeller,
        errorCompany,
        companyList,
        isConnected,
        handlePlusClick,
        phoneList,
        onRemovePhone,
        handleEmailPlusClick,
        emailList,
        onRemoveEmail,
        isLoading
    } = useSaleCreateContactPerson();
    const keyboardVerticalOffset = 30;

    return (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={keyboardVerticalOffset} style={styles.container}>
            <CustomHeader title={'Create Person'} showBack={true} />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollView}>
                <TextView title="Contact Person First Name" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="firstName"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="..."
                            containerStyle={styles.marginTop}
                            inputSize="medium"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.firstName?.message}
                        />
                    )}
                />
                <TextView title="Contact Person Last Name" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="lastName"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="..."
                            containerStyle={styles.marginTop}
                            inputSize="medium"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.lastName?.message}
                        />
                    )}
                />

                <TextView title="Order date" style={styles.marginTop} />
                <TouchableView
                    title={date}
                    style={styles.marginTop}
                    onPress={onOpenDate}
                    onClose={onclearDate}
                    onBlur={showDate}
                    icon={<DateIcon size={24} color={Colors.black} />}
                />
                <TextView title="Contact Person Phone" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="phone"
                    render={({ field: { onChange, value } }) => (
                        <>
                            <TextInput
                                placeholder="..."
                                containerStyle={styles.marginTop}
                                inputSize="medium"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.phone?.message}
                                keyboard="numeric"
                                plusIcon={true}
                                handlePlusClick={handlePlusClick}
                            />
                            {phoneList.length > 0 && (
                                <View style={styles.phoneListContainer}>
                                    {phoneList.map(phone => (
                                        <View key={phone} style={styles.phoneChip}>
                                            <Text style={styles.phoneChipText}>{phone}</Text>
                                            <TouchableOpacity onPress={() => onRemovePhone(phone)}>
                                                <AntDesign name="close" size={18} color={Colors.red} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                />
                <TextView title="Contact Person Email" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <>
                        <TextInput
                            placeholder="..."
                            containerStyle={styles.marginTop}
                            inputSize="medium"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.email?.message}
                            plusIcon={true}
                            handlePlusClick={handleEmailPlusClick}
                        />
                             
                             {emailList.length > 0 && (
                                <View style={styles.phoneListContainer}>
                                    {emailList.map(email => (
                                        <View key={email} style={styles.phoneChip}>
                                            <Text style={styles.phoneChipText}>{email}</Text>
                                            <TouchableOpacity onPress={() => onRemoveEmail(email)}>
                                                <AntDesign name="close" size={18} color={Colors.red} />
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            )}
                        </>
                    )}
                />
                <TextView title="Contact Person Position" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="position"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="..."
                            containerStyle={styles.marginTop}
                            inputSize="medium"
                            onChangeText={onChange}
                            value={value}
                            errorMessage={errors.position?.message}
                            keyboard="numeric"
                        />
                    )}
                />
                <View>
                    <TextView title="Seller / Buyer" style={styles.marginTop} />
                    <View style={styles.companyButtonContainer}>
                    <TouchableOpacity onPress={() => onSelectBuyerSeller('seller')} style={[styles.companyButton, { borderColor: selectedBuyerSeller.seller ? Colors.blue : Colors.gray, backgroundColor: selectedBuyerSeller.seller ? Colors.blue : Colors.white }]}>
                            <AntDesign name="check" size={22} color={Colors.white} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onSelectBuyerSeller('buyer')}
                            style={[styles.companyButton, {
                                borderColor: selectedBuyerSeller.buyer ? Colors.blue : Colors.gray,
                                backgroundColor: selectedBuyerSeller.buyer ? Colors.blue : Colors.white
                            }]}>
                            <AntDesign name="check" size={22} color={Colors.white} />
                        </TouchableOpacity>
                 
                    </View>
                </View>
                {(selectedBuyerSeller.buyer === true || selectedBuyerSeller.seller === true) && (
                    <>
                        <TextView title="Compnay" style={styles.marginTop} />
                        <Controller
                            control={control}
                            name="company"
                            render={({ field: { onChange, value } }) => (
                                <DropdownComponent
                                style={styles.marginTop}
                                data={isConnected ? companyList : []}
                                value={value}
                                onClick={({ value: selectedValue }) => onChange(selectedValue)}
                                errorMessage={errorCompany}
                            />
                            )}
                        />
                    </>
                )}
                <TextView title="Notes" style={styles.marginTop} />
                <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            placeholder="..."
                            containerStyle={styles.marginTop}
                            inputSize="medium"
                            onChangeText={onChange}
                            value={value}
                        />
                    )}
                />
                <Calender
                    isVisible={showDate}
                    onClose={() => onCloseDate()}
                    onConfirm={onConfirmDate}
                    value={
                        moment(date, 'DD/MM/YYYY', true).isValid()
                            ? moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD')
                            : undefined
                    }
                />
                <Botton
                    title={'Create'}
                    onHandler={handleSubmit(onCreateContactPerson)}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </ScrollView>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    marginTop: {
        marginTop: 10,
    },
    button: {
        marginTop: '5%',
    },
    scrollView: {
        flexGrow: 1,
        paddingBottom: 20,
    }, companyButtonContainer: {
        width: '91%',
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 30,
        marginTop: 10,
    },
    companyButton: {
        width: 30,
        height: 30,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: Colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phoneListContainer: {
        width: '93%',
        alignSelf: 'center',
        marginTop: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    phoneChip: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray_200,
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        gap: 8,
    },
    phoneChipText: {
        color: Colors.black,
    }
});