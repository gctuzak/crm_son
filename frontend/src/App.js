'use client';

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CustomerList from './components/customer/CustomerList';
import CustomerForm from './components/customer/CustomerForm';
import PersonForm from './components/person/PersonForm';
import CompanyForm from './components/company/CompanyForm';
import FileList from './components/file/FileList';
import FileUpload from './components/file/FileUpload';
import ActivityList from './components/activity/ActivityList';
import ActivityForm from './components/activity/ActivityForm';
import QuoteList from './components/quote/QuoteList';
import QuoteForm from './components/quote/QuoteForm';
import ProductList from './components/product/ProductList';
import ProductForm from './components/product/ProductForm';
import OrderList from './components/order/OrderList';
import OrderForm from './components/order/OrderForm';
import { AuthProvider } from './contexts/AuthContext';
import PersonList from './components/person/PersonList';
import CompanyList from './components/company/CompanyList';
import UserList from './components/user/UserList';

const PageWithLayout = ({ children }) => (
    <Layout>
        {children}
    </Layout>
);

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    <Route path="/dashboard" element={
                        <PageWithLayout>
                            <Dashboard />
                        </PageWithLayout>
                    } />

                    <Route path="/customers" element={
                        <PageWithLayout>
                            <CustomerList />
                        </PageWithLayout>
                    } />

                    <Route path="/customers/new" element={
                        <PageWithLayout>
                            <CustomerForm />
                        </PageWithLayout>
                    } />

                    <Route path="/customers/edit/:id" element={
                        <PageWithLayout>
                            <CustomerForm />
                        </PageWithLayout>
                    } />

                    <Route path="/orders" element={
                        <PageWithLayout>
                            <OrderList />
                        </PageWithLayout>
                    } />

                    <Route path="/orders/new" element={
                        <PageWithLayout>
                            <OrderForm />
                        </PageWithLayout>
                    } />

                    <Route path="/products" element={
                        <PageWithLayout>
                            <ProductList />
                        </PageWithLayout>
                    } />

                    <Route path="/products/new" element={
                        <PageWithLayout>
                            <ProductForm />
                        </PageWithLayout>
                    } />

                    <Route path="/products/:id/edit" element={
                        <PageWithLayout>
                            <ProductForm />
                        </PageWithLayout>
                    } />

                    <Route path="/quotes" element={
                        <PageWithLayout>
                            <QuoteList />
                        </PageWithLayout>
                    } />

                    <Route path="/quotes/new" element={
                        <PageWithLayout>
                            <QuoteForm />
                        </PageWithLayout>
                    } />

                    <Route path="/quotes/edit/:id" element={
                        <PageWithLayout>
                            <QuoteForm />
                        </PageWithLayout>
                    } />

                    <Route path="/activities" element={
                        <PageWithLayout>
                            <ActivityList />
                        </PageWithLayout>
                    } />

                    <Route path="/activities/new" element={
                        <PageWithLayout>
                            <ActivityForm />
                        </PageWithLayout>
                    } />

                    <Route path="/persons" element={
                        <PageWithLayout>
                            <PersonList />
                        </PageWithLayout>
                    } />

                    <Route path="/persons/new" element={
                        <PageWithLayout>
                            <PersonForm />
                        </PageWithLayout>
                    } />

                    <Route path="/persons/:id/edit" element={
                        <PageWithLayout>
                            <PersonForm />
                        </PageWithLayout>
                    } />

                    <Route path="/companies" element={
                        <PageWithLayout>
                            <CompanyList />
                        </PageWithLayout>
                    } />

                    <Route path="/companies/new" element={
                        <PageWithLayout>
                            <CompanyForm />
                        </PageWithLayout>
                    } />

                    <Route path="/companies/edit/:id" element={
                        <PageWithLayout>
                            <CompanyForm />
                        </PageWithLayout>
                    } />

                    <Route path="/files" element={
                        <PageWithLayout>
                            <FileList />
                        </PageWithLayout>
                    } />

                    <Route path="/files/upload" element={
                        <PageWithLayout>
                            <FileUpload />
                        </PageWithLayout>
                    } />

                    <Route path="/users" element={
                        <PageWithLayout>
                            <UserList />
                        </PageWithLayout>
                    } />

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
