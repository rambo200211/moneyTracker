import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllTransactions } from '../database/db';
import dayjs from 'dayjs';

export default function HomeScreen({ navigation }: any) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  const loadData = () => {
    const data: any[] = getAllTransactions();
    setTransactions(data);

    let inc = 0, exp = 0;
    data.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      else exp += t.amount;
    });
    setIncome(inc);
    setExpense(exp);
    setBalance(inc - exp);
  };

  // පිටුවට එන හැම වෙලාවෙම දත්ත අලුත් කරන්න
  useFocusEffect(useCallback(() => { loadData(); }, []));

  return (
    <View className="flex-1 bg-slate-50 p-5 pt-12">
      {/* Balance Card */}
      <View className="bg-slate-800 rounded-3xl p-6 shadow-lg mb-6">
        <Text className="text-slate-300 text-sm mb-1">වර්තමාන ශේෂය (Balance)</Text>
        <Text className="text-white text-4xl font-bold mb-4">Rs. {balance.toLocaleString()}</Text>
        <View className="flex-row justify-between pt-4 border-t border-slate-600">
          <View>
            <Text className="text-green-400 text-xs">ආදායම ↑</Text>
            <Text className="text-white font-semibold">+{income}</Text>
          </View>
          <View>
            <Text className="text-red-400 text-xs">වියදම ↓</Text>
            <Text className="text-white font-semibold">-{expense}</Text>
          </View>
        </View>
      </View>

      <Text className="text-lg font-bold text-slate-800 mb-3">මෑත ගනුදෙනු</Text>
      
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="text-center text-slate-400 mt-10">ගනුදෙනු නැත. අලුත් එකක් එකතු කරන්න.</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 flex-row justify-between items-center shadow-sm">
            <View>
              <Text className="font-bold text-slate-700">{item.category}</Text>
              <Text className="text-xs text-slate-400">{dayjs(item.date).format('MMM DD, YYYY')}</Text>
            </View>
            <Text className={`font-bold ${item.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
              {item.type === 'income' ? '+' : '-'} Rs. {item.amount}
            </Text>
          </View>
        )}
      />
      
      {/* Floating Add Button */}
      <TouchableOpacity 
        className="absolute bottom-6 right-6 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => navigation.navigate('Add')}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </TouchableOpacity>
    </View>
  );
}