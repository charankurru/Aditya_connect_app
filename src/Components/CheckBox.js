import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

function CheckBox({ id, label, status, onPress }) {
    return (
        <TouchableOpacity onPress={() => onPress(id)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Checkbox status={status} />
                <Text style={{ fontWeight: 'bold' }}>{label}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default CheckBox;
