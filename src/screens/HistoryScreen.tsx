import React, { useState, useCallback } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMonthlySummaries } from '../database/db';

export default function HistoryScreen() {
  const [history, setHistory] = useState<any[]>([]);

  useFocusEffect(useCallback(() => {
    setHistory(getMonthlySummaries());
  }, []));

  return (
    <View className="flex-1 bg-slate-50 p-5 pt-12">
      <Text className="text-2xl font-bold text-slate-800 mb-6">මාසික ඉතිහාසය</Text>
      
      <FlatList
        data={history}
        keyExtractor={(item) => item.month_key}
        ListEmptyComponent={<Text className="text-center text-slate-400 mt-10">මාසයක් අවසන් වූ පසු මෙහි දත්ත පෙන්වයි.</Text>}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-sm">
            <Text className="text-lg font-bold text-slate-800 mb-3">{item.month_key}</Text>
            
            <View className="flex-row justify-between mb-2">
              <Text className="text-slate-500">මුල් ශේෂය:</Text>
              <Text className="font-semibold">Rs. {item.opening_balance}</Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-green-500">ආදායම:</Text>
              <Text className="text-green-500 font-semibold">+Rs. {item.total_income}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-red-500">වියදම:</Text>
              <Text className="text-red-500 font-semibold">-Rs. {item.total_expense}</Text>
            </View>
            
            <View className="flex-row justify-between pt-3 border-t border-slate-100">
              <Text className="font-bold text-slate-700">අවසාන ශේෂය:</Text>
              <Text className="font-bold text-blue-600 text-lg">Rs. {item.closing_balance}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}