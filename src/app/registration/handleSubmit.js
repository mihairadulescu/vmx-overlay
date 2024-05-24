import axios from 'axios';

const handleSubmit = async (values, { setSubmitting, resetForm, setFieldValue, setStatus }) => {
  try {
    const response = await axios.post('/api/register', values);
    console.log(response.data);
    const qrCodeData = response.data.qrCodeData;
    setFieldValue('qrCode', qrCodeData);
    setStatus({ success: true, data: { ...values, qrCode: qrCodeData } });
  } catch (error) {
    console.error(error);
    setStatus({ success: false });
  }
  setSubmitting(false);
};

export default handleSubmit;
