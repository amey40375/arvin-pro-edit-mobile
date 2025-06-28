
import { supabase } from "@/integrations/supabase/client";

// User management functions
export const getUsersByStatus = async (status: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('status', status);
  if (error) throw error;
  return data || [];
};

export const updateUserStatus = async (userId: number, status: string) => {
  const { error } = await supabase
    .from('users')
    .update({ status })
    .eq('id', userId);
  if (error) throw error;
};

export const createUser = async (userData: any) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      full_name: userData.fullName,
      email: userData.email,
      password: userData.password,
      profile_photo: userData.profilePhoto,
      status: 'pending',
      registration_date: new Date().toISOString()
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();
  if (error) throw error;
  return data;
};

// Orders management functions
export const createOrder = async (orderData: any) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([{
      user_name: orderData.userName,
      user_email: orderData.userEmail,
      service: orderData.service,
      description: orderData.description,
      file_name: orderData.file,
      status: 'pending'
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getOrdersByUser = async (userEmail: string) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_email', userEmail)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getAllOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
};

export const updateOrderStatus = async (orderId: number, status: string, price?: string) => {
  const updateData: any = { status, updated_at: new Date().toISOString() };
  if (price) updateData.price = parseInt(price);
  
  const { error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId);
  if (error) throw error;
};

// Invoice management functions
export const createInvoice = async (invoiceData: any) => {
  const { data, error } = await supabase
    .from('invoices')
    .insert([{
      order_id: invoiceData.orderId,
      user_id: invoiceData.userId,
      amount: invoiceData.price,
      status: 'paid'
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const getInvoiceByOrderId = async (orderId: number) => {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('order_id', orderId)
    .single();
  if (error) throw error;
  return data;
};

// Chat messages functions
export const getChatMessages = async () => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
};

export const createChatMessage = async (messageData: any) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert([{
      message: messageData.text,
      user_name: messageData.sender,
      user_email: messageData.senderEmail,
      is_admin: messageData.isAdmin || false,
      sender: messageData.sender,
      sender_email: messageData.senderEmail,
      timestamp: new Date().toISOString(),
      reply_to: messageData.replyTo || null
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

// App settings functions
export const getAppSetting = async (key: string): Promise<string> => {
  const { data, error } = await supabase
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .single();
  if (error) throw error;
  
  if (data?.value) {
    if (typeof data.value === 'string') {
      return data.value.replace(/^"|"$/g, '');
    }
    return JSON.stringify(data.value).replace(/^"|"$/g, '');
  }
  return '';
};

export const updateAppSetting = async (key: string, value: any) => {
  const { error } = await supabase
    .from('app_settings')
    .upsert({
      key,
      value: JSON.stringify(value),
      updated_at: new Date().toISOString()
    });
  if (error) throw error;
};
