import CodeInput from './CodeInput';

type PinInputProps = Omit<React.ComponentProps<typeof CodeInput>, 'masked' | 'length'> & {
  length?: number;
};

/** PIN Input WDS: seperti OTP tetapi karakter disamarkan. */
function PinInput({ length = 4, ...props }: PinInputProps) {
  return <CodeInput {...props} length={length} masked />;
}

export default PinInput;
