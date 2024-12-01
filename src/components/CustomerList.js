import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CustomerList = ({ route }) => {
  console.log(route.params);
  const { data } = route.params;
  const { fields } = data;
  console.log(data);
  console.log(fields);

  return (
    <View>
      {}
      <Text>CustomerList</Text>
      <Text>Name: {data.name}</Text>
      <Text>Contact:{data.number}</Text>
      <Text>Address:{data.address}</Text>
      <Text>Billing date:{data.billingdate}</Text>
      {
        fields && fields.length > 0 ? (
          fields.map((field, index) => (
            <View key={index}>
              <Text>Item: {field.item}</Text>
              <Text>Quantity: {field.quantity}</Text>
              <Text>Price: {field.price}</Text>
            </View>
          ))
        ) :
          (
            <Text>
              No data Available
            </Text>
          )
      }
    </View>
  )
}

export default CustomerList

const styles = StyleSheet.create({})