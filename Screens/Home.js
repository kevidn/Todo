import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const todoRef = firebase.firestore().collection('todos');
    const [addData, setAddData] = useState('');
    const navigation = useNavigation();

    // Fetch atau read data dari firestore.
    useEffect(() => { 
        todoRef
        .orderBy('createdAt', 'desc')
        .onSnapshot(
            QuerySnapshot => {
                const Todos = [];
                QuerySnapshot.forEach((doc) => {
                    const { heading } = doc.data();
                    Todos.push({
                        id: doc.id,
                        heading,
                    });
                });
                setTodos(Todos);
            }
        );
    }, []);

    // Menghapus task/tugas dari database firestore.
    const deleteTodo = (todo) => {
        todoRef
            .doc(todo.id)
            .delete()
            .then(() => {
                // Menampilkan peringatan sukses.
                alert('Task berhasil dihapus!');
            })
            .catch((error) => {
                alert(error);
            });
    };

    // Menampilkan konfirmasi sebelum menghapus task/tugas.
    const confirmDeleteTodo = (todo) => {
        Alert.alert(
            "Hapus Task",
            "Apakah Anda yakin ingin menghapus task ini?",
            [
                {
                    text: "Batal",
                    onPress: () => console.log("Penghapusan dibatalkan"),
                    style: "cancel"
                },
                {
                    text: "Hapus", 
                    onPress: () => deleteTodo(todo),
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

    // Menambahkan task/tugas ke database firestore.
    const addTodo = () => {
        // Mengecek apakah ada task/tugas.
        if (addData && addData.length > 0){
            // Mengambil timestamp saat ini.
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: addData,
                createdAt: timestamp,
            };
            todoRef
                .add(data)
                .then(() => {
                    setAddData('');
                    // Me-release keyboard.
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    return (
        <View style={{ flex:1 }}>
            <View style={styles.formContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder='Tambah Task Baru'
                    placeholderTextColor={'#aaaaaa'}
                    onChangeText={(heading) => setAddData(heading)}
                    value={addData}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addTodo}>
                    <Text style={styles.buttonText}>Tambah</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={todos}
                keyExtractor={(item) => item.id}
                numColumns={1}
                renderItem={({ item }) => (
                    <View>
                        <Pressable 
                            style={styles.container}
                            onPress={() => navigation.navigate('Detail', { item })}
                        >
                            <FontAwesome
                                name='trash-o'
                                color='red'
                                onPress={() => confirmDeleteTodo(item)}
                                style={styles.todoIcon}
                            />
                            <View style={styles.innerContainer}>
                                <Text style={styles.heading}>
                                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#e5e5e5',
        padding:15,
        borderRadius:15,
        margin:5,
        marginHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
    },
    innerContainer:{
        alignItems:'center',
        flexDirection:'column',
        marginLeft:45,
    },
    heading:{
        fontWeight:'bold',
        fontSize:18,
        marginRight:22,
    },
    formContainer:{
        flexDirection:'row',
        height:80,
        marginLeft:10,
        marginRight:10,
        marginTop:100,
    },
    input:{
        height: 48,
        borderRadius:5,
        overflow:'hidden',
        backgroundColor:'white',
        paddingLeft:16,
        flex:1,
        marginRight:5,
    },
    button:{
        height:47,
        borderRadius:5,
        backgroundColor:"#788eec",
        width:80,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText:{
        color:'white',
        fontSize:20,
    },
    todoIcon:{
        marginTop:5, 
        fontSize:20,
        marginLeft:14,
    },
});
