"use client";

import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import handleSubmit from './handleSubmit';
import ReactToPrint from 'react-to-print';
import Presenter from './presenter';

const RegistrationSchema = Yup.object().shape({ 
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  organisation: Yup.string().required('Required'),
});

const Registration = () => {
  const [status, setStatus] = useState({ success: false, data: null });
  const componentRef = useRef();

  const handleBack = () => {
    setStatus({ success: false, data: null });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {!status.success ? (
        <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-md" style={{color:"black"}}>
          <h1 className="text-2xl font-bold text-center">Registration Page</h1>
          <Formik
            initialValues={{  firstName: '', lastName: '', organisation: '' }}
            validationSchema={RegistrationSchema}
            onSubmit={(values, actions) => handleSubmit(values, { ...actions, setStatus })}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-4"> 
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <Field
                    type="text"
                    name="firstName"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="firstName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="secondName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="organisation" className="block text-sm font-medium text-gray-700">Organisation</label>
                  <Field
                    type="text"
                    name="organisation"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="organisation" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  >
                    Submit
                  </button>
                </div>
                {values.qrCode && (
                  <div className="mt-4 text-center">
                    <img src={values.qrCode} alt="QR Code" style={{ width: '96px', height: '96px' }} />
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <Presenter ref={componentRef} data={status.data} />
          <div className="mt-4 flex w-full justify-between px-4">
            <button
              onClick={handleBack}
              className="px-4 py-2 font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
            >
              Back
            </button>
            <ReactToPrint
              trigger={() => (
                <button className="px-4 py-2 font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">
                  Print
                </button>
              )}
              content={() => componentRef.current}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Registration;
