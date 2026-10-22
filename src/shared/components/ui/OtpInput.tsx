import CodeInput from './CodeInput';

type OtpInputProps = Omit<React.ComponentProps<typeof CodeInput>, 'masked'>;

/** OTP Input WDS: kode sekali pakai per-karakter. */
function OtpInput(props: OtpInputProps) {
  return <CodeInput {...props} />;
}

export default OtpInput;
