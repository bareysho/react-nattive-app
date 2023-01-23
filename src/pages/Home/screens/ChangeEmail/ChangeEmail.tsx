import React, { FC, useCallback } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Formik, FormikErrors } from 'formik';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

import {
  Box,
  Button,
  Center,
  Icon,
  InputControlled,
  Text,
  VStack,
  FormError,
} from '@src/components/UI';
import { useAppDispatch } from '@src/redux/store';
import { IChangeEmailFormValues, IOtpFormValues } from '@src/types/form';
import { PageWithOtpState } from '@src/enums/otpCode';
import { usePageWithOtpForm } from '@src/hooks/usePageWithOtpForm';
import { TimerName } from '@src/enums/timer';
import { useForm } from '@src/hooks/useForm';
import { required, validateEmail } from '@src/validators/common';
import { PageLayout } from '@src/components/PageLayout';
import { OtpTimerInfo } from '@src/components/OtpTimerInfo';
import { OtpConfirmationForm } from '@src/components/OtpConfirmationForm';
import {
  changeEmailAction,
  requestChangeEmailAction,
} from '@src/redux/actions/emailActions';

const CHANGE_EMAIL_FORM_INITIAL_VALUES: IChangeEmailFormValues = {
  email: '',
};

const CHANGE_EMAIL_ERROR_MAPPER: Record<
  string,
  FormikErrors<IChangeEmailFormValues>
> = {
  INVALID_CREDENTIALS: {
    email: 'Email уже зарегистрирован',
  },
};

export const ChangeEmail: FC<NativeStackScreenProps<ParamListBase>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();

  const onRequestOtp = async ({ email }: IChangeEmailFormValues) => {
    await dispatch(requestChangeEmailAction({ email })).unwrap();
  };

  const {
    pageState,
    restTime,
    resendCode,
    submitRequestCode,
    storedFormValues: changeEmailFormValues,
    setPageState,
    cancelVerification,
    isNeedDisableForm,
    isTimerInitializing,
  } = usePageWithOtpForm<IChangeEmailFormValues>({
    name: TimerName.ChangeEmailCode,
    onRequestOtp,
    initValues: CHANGE_EMAIL_FORM_INITIAL_VALUES,
  });

  const { validate, onSubmit, submitRequestError } =
    useForm<IChangeEmailFormValues>({
      submitCallback: submitRequestCode,
      fieldsValidators: {
        email: [required, validateEmail],
      },
      errorMapper: CHANGE_EMAIL_ERROR_MAPPER,
    });

  const submitOtpVerification = useCallback(
    async ({ otp }: IOtpFormValues) => {
      await dispatch(
        changeEmailAction({
          otp,
          email: changeEmailFormValues.email,
        }),
      ).unwrap();

      setPageState(PageWithOtpState.SuccessUpdate);
    },
    [dispatch, changeEmailFormValues],
  );

  return (
    <PageLayout>
      <Box width="100%">
        {pageState !== PageWithOtpState.SuccessUpdate && (
          <>
            <Text fontSize={20} fontWeight={600}>
              Изменение email
            </Text>

            <Text fontSize={18} fontWeight={300} mt={1}>
              Следуйте инструкциям
            </Text>

            <Center width="100%" my={36}>
              <MaterialIcons name={'email'} size={98} color="gray" />
            </Center>
          </>
        )}

        <Formik<IChangeEmailFormValues>
          initialValues={CHANGE_EMAIL_FORM_INITIAL_VALUES}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange
          validateOnBlur
        >
          {formik => {
            const isDisabledFields = formik.isSubmitting || isNeedDisableForm;

            return (
              <VStack width="100%" mt={5}>
                {pageState !== PageWithOtpState.SuccessUpdate && (
                  <>
                    <InputControlled
                      label="Email"
                      isDisabled={isDisabledFields}
                      error={formik.errors.email}
                      value={formik.values.email}
                      isInvalid={Boolean(
                        formik.touched.email || formik.submitCount,
                      )}
                      onChangeText={formik.handleChange('email')}
                      onBlur={formik.handleBlur('email')}
                      placeholder="Введите email"
                    />

                    {submitRequestError && (
                      <FormError message={submitRequestError} />
                    )}
                  </>
                )}

                {pageState === PageWithOtpState.Init && (
                  <>
                    <Button
                      mt={8}
                      width="100%"
                      onPress={formik.handleSubmit}
                      isDisabled={!!restTime || isDisabledFields}
                      isLoading={formik.isSubmitting}
                    >
                      Отправить код
                    </Button>

                    {!!restTime && (
                      <Box mt={4}>
                        <OtpTimerInfo timeLeft={restTime} />
                      </Box>
                    )}
                  </>
                )}
              </VStack>
            );
          }}
        </Formik>

        {pageState === PageWithOtpState.CodeSent && changeEmailFormValues && (
          <OtpConfirmationForm
            resendCode={resendCode}
            restTime={restTime}
            isTimerInitializing={isTimerInitializing}
            cancelVerification={cancelVerification}
            submitCallback={submitOtpVerification}
          />
        )}

        {pageState === PageWithOtpState.SuccessUpdate && (
          <Center width="100%" my={30}>
            <Icon
              size={160}
              as={<MaterialIcons name={'check-circle-outline'} />}
            />

            <Text my={16}>Email успешно обновлен. </Text>

            <Button width="100%" variant="solid" onPress={navigation.goBack}>
              Назад
            </Button>
          </Center>
        )}
      </Box>
    </PageLayout>
  );
};
