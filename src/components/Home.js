import { Alert, Button, Dimensions, ScrollView, StyleSheet, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('screen')
export default function Home() {
    const navigation=useNavigation();

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [address, setAddress] = useState('');
    const [billingdate, setBillingDate] = useState(formattedDate);
    const [fields, setFields] = useState([{ 
        item: '', quantity: 0, price: 0 
    }])

    const handleButton = () => {
        setFields([...fields, { item: '', quantity: 0, price: 0 }]);
    }

    //total value
    const total = useMemo(() => {
        return fields.reduce((acc, fields) => acc + fields.quantity * fields.price, 0)
    }, [fields]);


    const handleGenerate = async () => {
        if (!name || !number || fields.some(field=>!field.item||field.quantity<=0||field.price<=0)) {
            Alert.alert('Error', 'Please provide all the fields');
            return;
        }

        const itemsHTML = fields.map((field, index) => `
         <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${field.item || '-'}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${field.quantity}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">₹${field.price.toFixed(2)}</td>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">₹${(field.quantity * field.price).toFixed(2)}</td>
        </tr>
        `).join(' ');

        const htmlPart = `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                h1 {
                    text-align: center;
                    color: #333;
                }
                .info {
                    margin-bottom: 20px;
                }
                .info p {
                    margin: 5px 0;
                }
            </style>
        </head>
        <body>
            <h1>Invoice</h1>
            <div class="info">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Contact:</strong> ${number}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Billing Date:</strong> ${billingdate}</p>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" style="text-align: right; padding: 8px;"><strong>Grand Total:</strong></td>
                        <td style="text-align: center; padding: 8px;"><strong>₹${total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
        </body>
    </html>
    `;
    console.log(htmlPart)

        try {
            let options = {
                html: htmlPart,
                fileName: `invoice_${Date.now()}`,
                directory: 'Documents'
            }
            console.log(options)
            let file = await RNHTMLtoPDF.convert(options)
            console.log(file.filePath);
            Alert.alert("done",`${file.filePath}`);
            const data={
                name,
                number,
                address,
                billingdate,
                fields
            }
            navigation.navigate('CustomerList',{data});

            
            //setFields([{ item: '', quantity: 0, price: 0 }]);
        } catch {
            Alert.alert("Error", "Total Calculation failed");
        }
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={[styles.nameContainer, { marginTop: 20 }]}>
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>*</Text>
                    <Text>Name</Text>
                </View>
                <View style={{ marginTop: 15 }}>
                    <TextInput placeholder='Enter your name' style={[styles.input, { width: width - 20 }]} onChangeText={setName} />
                </View>
                <View style={[styles.nameContainer, { marginTop: 10 }]}>
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>*</Text>
                    <Text>Number</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput placeholder='Enter your Contact number' style={[styles.input, { width: width - 20 }]} onChangeText={setNumber} />
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>Address</Text>
                    <TextInput placeholder='Address' style={[styles.input, { width: width - 20 }]} onChangeText={setAddress} />
                </View>
                <View style={[styles.nameContainer, { marginTop: 10 }]}>
                    <Text style={{ color: 'red', marginHorizontal: 10 }}>*</Text>
                    <Text>Billing Date</Text>
                </View>
                <View style={{ marginTop: 10 }}>
                    <TextInput placeholder='Billing Date' style={[styles.input, { width: width - 20 }]} value={billingdate} onChangeText={setBillingDate} />
                </View>


                {fields.map((field, index) => (
                    <View key={index} style={{ marginTop: 10 }}>
                        <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>Item {index + 1}</Text>
                        <TextInput
                            placeholder="Item"
                            style={[styles.input, { width: width - 20, marginBottom: 10 }]}
                            value={field.item}
                            onChangeText={(text) => {
                                const updatedFields = [...fields];
                                updatedFields[index].item = text;
                                setFields(updatedFields);
                            }}
                        />

                        <View style={[styles.nameContainer, { width: width / 2 - 20 }]}>
                            <View style={[styles.inputContainer, { width: width / 2 - 10 }]}>
                                <Text style={styles.label}>Product Quantity</Text>
                                <TextInput
                                    placeholder="Quantity"
                                    style={styles.input}
                                    value={String(field.quantity)}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        const updatedFields = [...fields];
                                        updatedFields[index].quantity = parseInt(text) || 0;
                                        setFields(updatedFields);
                                    }}
                                />
                            </View>
                            <View style={{ width: width / 2 - 10 }}>
                                <Text style={styles.label}>Billing Price</Text>
                                <TextInput
                                    placeholder="Price"
                                    style={styles.input}
                                    value={String(field.price)}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        const updatedFields = [...fields];
                                        updatedFields[index].price = parseFloat(text) || 0;
                                        setFields(updatedFields);
                                    }}
                                />
                            </View>

                        </View>
                    </View>
                ))}
                <TouchableOpacity onPress={handleButton} style={{ alignSelf: 'center', backgroundColor: 'paleturquoise', height: 50, width: width, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginTop: 20 }}>
                    <Text>+ Add More fields</Text>
                </TouchableOpacity>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <View style={styles.totalValueContainer}>
                        <FontAwesome name="rupee" color="black" size={30} />
                        <Text style={styles.totalValue}>{total}</Text>
                    </View>
                </View>

                {/* <View style={{ marginTop: 10 }}>
                    <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>Item</Text>
                    <TextInput placeholder='Item' style={[styles.input, { width: width - 20 }]} onChangeText={setItem} />
                </View>
                <View style={{ marginTop: 10 }}>
                    <View style={styles.nameContainer}>
                        <View>
                            <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>Product Quantity</Text>
                            <TextInput placeholder='Quantity' style={[styles.input, { width: width / 2 - 20 }]} onChangeText={setQuantity} />
                        </View>
                        <View>
                            <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>Billing Price</Text>
                            <TextInput placeholder='Price' style={[styles.input, { width: width / 2 - 20 }]} onChangeText={setPrice} />
                        </View>
                    </View>
                </View>
                <View style={[styles.nameContainer, { marginTop: 10 }]}>
                    <Text style={{ marginHorizontal: 30 }}>Total:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                        <FontAwesome name="rupee" color="black" size={30} />
                        <Text style={{ paddingHorizontal: 20, fontSize: 30, width: width / 2 }}>{total}</Text>
                    </View>
                </View> */}
                <TouchableOpacity onPress={handleGenerate} style={{ alignSelf: 'center', backgroundColor: 'dodgerblue', height: 80, width: width / 2, alignItems: 'center', justifyContent: 'center', borderRadius: 20, marginTop: 20, marginBottom: 20 }}>
                    <Text>Generate Pdf</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'flex-start',
        marginTop: 40
    },
    nameContainer: {
        flexDirection: 'row',
        width: 100,
    },
    input: {
        borderWidth: 1,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: 'aliceblue',
        height: 50,
    },
    label: {
        paddingHorizontal: 10,
        paddingBottom: 10

    },
    totalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 20,
        paddingBottom: 40
    },
    totalLabel: {
        paddingHorizontal: 10
    },
    totalValueContainer: {
        flexDirection: 'row',
        paddingHorizontal: 40,
        justifyContent: 'center',
        alignContent: 'center'

    },
    totalValue: {
        paddingHorizontal: 20,
        fontSize: 20
    },


})