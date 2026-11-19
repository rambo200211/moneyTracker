import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { addTransaction } from '../database/db';
import dayjs from 'dayjs';

export default function AddScreen({ navigation }: any) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('ආහාර');
  const [note, setNote] = useState('');

  const categories = type === 'expense' 
    ? ['ආහාර', 'ප්‍රවාහන', 'බිල්පත්', 'සෞඛ්‍ය', 'විනෝදය', 'වෙනත්']
    : ['පඩිය', 'ව්‍යාපාර', 'ආයෝජන', 'ත්‍යාග', 'වෙනත්'];

  const handleSave = () => {
    if (!amount) return Alert.alert("දෝෂයකි", "කරුණාකර මුදල ඇතුළත් කරන්න.");
    
    addTransaction(Number(amount), type, category, dayjs().format('YYYY-MM-DD'), note);
    navigation.goBack(); // සේව් වුණාට පස්සේ Home එකට යන්න
  };

  return (
    <View className="flex-1 bg-slate-50 p-5 pt-12">
      <Text className="text-2xl font-bold text-slate-800 mb-6">අලුත් ගනුදෙනුවක්</Text>

      {/* Type Toggle */}
      <View className="flex-row mb-6 bg-slate-200 p-1 rounded-xl">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg items-center ${type === 'expense' ? 'bg-white shadow-sm' : ''}`}
          onPress={() => { setType('expense'); setCategory('ආහාර'); }}
        >
          <Text className={type === 'expense' ? 'font-bold text-red-500' : 'text-slate-500'}>වියදම</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-lg items-center ${type === 'income' ? 'bg-white shadow-sm' : ''}`}
          onPress={() => { setType('income'); setCategory('පඩිය'); }}
        >
          <Text className={type === 'income' ? 'font-bold text-green-500' : 'text-slate-500'}>ආදායම</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-slate-600 mb-1">මුදල (Rs.)</Text>
      <TextInput 
        className="bg-white p-4 rounded-xl text-lg font-bold mb-4 shadow-sm"
        keyboardType="numeric"
        placeholder="0.00"
        value={amount}
        onChangeText={setAmount}
      />

      <Text className="text-slate-600 mb-2">කාණ්ඩය (Category)</Text>
      <View className="flex-row flex-wrap mb-4">
        {categories.map(cat => (
          <TouchableOpacity 
            key={cat}
            onPress={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full mr-2 mb-2 ${category === cat ? 'bg-blue-600' : 'bg-white border border-slate-200'}`}
          >
            <Text className={category === cat ? 'text-white' : 'text-slate-600'}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="text-slate-600 mb-1">සටහන (Optional)</Text>
      <TextInput 
        className="bg-white p-4 rounded-xl mb-8 shadow-sm"
        placeholder="විස්තරයක්..."
        value={note}
        onChangeText={setNote}
      />

      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-xl items-center shadow-md"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-lg">සුරකින්න (Save)</Text>
      </TouchableOpacity>
    </View>
  );
}