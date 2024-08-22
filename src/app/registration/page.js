"use client";

import React, { useState, useRef } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import handleSubmit from './handleSubmit';
import ReactToPrint from 'react-to-print';
import Presenter from './presenter';

const RegistrationSchema = Yup.object().shape({
  id: Yup.string().required('Required'),
  firstName: Yup.string().required('Required'),
  secondName: Yup.string().required('Required'),
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
            initialValues={{ title: '', firstName: '', lastName: '', city: '', country: '', qrCode: '' }}
            validationSchema={RegistrationSchema}
            onSubmit={(values, actions) => handleSubmit(values, { ...actions, setStatus })}
          >
            {({ isSubmitting, values }) => (
              <Form className="space-y-4">
                <div>
                  <label htmlFor="id" className="block text-sm font-medium text-gray-700">Id</label>
                  <Field
                    type="text"
                    name="name"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="id" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">First Name</label>
                  <Field
                    type="text"
                    name="organisation"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="secondName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <Field
                    type="text"
                    name="lastName"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="secondName" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <Field
                    type="text"
                    name="city"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="city" component="div" className="mt-1 text-sm text-red-600" />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                  <Field
                    type="text"
                    name="country"
                    className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <ErrorMessage name="country" component="div" className="mt-1 text-sm text-red-600" />
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
