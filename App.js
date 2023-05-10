
// Se der erro de Hooks, rodar : npm install @react-native-picker/picker --legacy-peer-deps


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Keyboard, Image } from 'react-native';
import Picker from './src/componentes/Picker';
import api from './src/services/api';

export default function App() {
  const [moedas, setMoedas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [moedaSelecionada, setMoedaSelecionada] = useState(null);
  const [moedaBValor, setMoedaBValor] = useState(0);

  const [valorMoeda, setValorMoeda] = useState(null);
  const [valorConvertido, setValorConvertido] = useState(0)



  useEffect(() => {
    async function loadMoedas() {
      const response = await api.get('all')

      let arrayMoedas = []
      Object.keys(response.data).map((key) => {
        arrayMoedas.push({
          key: key,
          label: key,
          value: key
        })
      })

      setMoedas(arrayMoedas);
      setLoading(false)
    }

    loadMoedas();
  }, [])

  async function converter() {
    if (moedaSelecionada === null || moedaBValor === 0) {
      alert('Preencha todos os Campos!');
      return;
    }

    //USD-BRL ele devolve quanto é 1 dolar convertido para Real
    const response = await api.get(`all/${moedaSelecionada}-BRL`);
    //console.log(response.data[moedaSelecionada].ask)

    let resultado = (response.data[moedaSelecionada].ask * parseFloat(moedaBValor))
    setValorConvertido(`R$ ${resultado.toFixed(2)}`);
    setValorMoeda(moedaBValor)

    //fechar teclado apos operação
    Keyboard.dismiss();
  }

  if (loading) {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        <ActivityIndicator color='#FFF' size={45} />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.carlos}>
          <Image
            style={styles.logo}
            source={require('./src/img/LOGO.png')}
          />
          <Text style={styles.carlosText}>Carlos Negromonte</Text>
        </View>

        <View style={styles.areaConversor}>
          <Text style={styles.textConversor}>Conversor de Moedas</Text>
        </View>

        <View style={styles.areaMoeda}>
          <Text style={styles.titulo}>Selecione sua moeda:</Text>

          <Picker moedas={moedas} onChange={(moeda) => setMoedaSelecionada(moeda)} />

          <View style={styles.areaValor}>
            <Text style={[styles.titulo, { fontSize: 15 }]}>Digite um valor para conversão em (R$) :</Text>
            <TextInput
              keyboardType='numeric'
              placeholder='EX: 150'
              style={styles.input}
              onChangeText={(valor) => setMoedaBValor(valor)}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.areaBotao} onPress={converter}>
          <Text style={styles.botaoText}>Converter</Text>
        </TouchableOpacity>


        {valorConvertido !== 0 && (

          <View style={styles.areaResultado}>
            <Text style={[styles.valorConvertido, { color: '#fff' }]}> {valorMoeda} - {moedaSelecionada}</Text>
            <Text style={[styles.valorConvertido, { fontSize: 18, margin: 10 }]}>Corrensponde a: </Text>
            <Text style={[styles.valorConvertido, { color: '#fff' }]}>{valorConvertido}</Text>
          </View>

        )}


      </View>
    )

  }



}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textConversor:{
    color: '#fff',
    fontSize: 24,
    marginBottom: 5
  },
  areaConversor:{
    backgroundColor: '#4682B4',
    width: 300,
    alignItems: 'center',
    borderRadius: 15

  },
  logo: {
    width: 60,
    height: 60,
    
  },
  areaMoeda: {
    width: '90%',
    backgroundColor: '#4682B4',
    paddingTop: 10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 10


  },
  titulo: {
    fontSize: 20,
    paddingLeft: 5,
    color: '#fff',
    marginTop: 10,
    marginLeft: 10
  },

  areaValor: {
    width: '90%',
    backgroundColor: '#4682B4',
    marginBottom: 10,

  },
  input: {
    width: '90%',
    fontSize: 20,
    marginTop: 8,
    color: '#000',
    height: 45,
    paddingLeft: 15,

  },
  areaBotao: {
    width: '90%',
    backgroundColor: '#FB4b57',
    height: 45,
    justifyContent: 'center',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  botaoText: {
    textAlign: 'center',
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold'

  },
  areaResultado: {
    width: '70%',
    backgroundColor: '#4682B4',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    padding: 25,
    borderRadius: 30

  },
  valorConvertido: {
    fontSize: 30,
    padding: 3,
    color: '#000'
  },
  carlos: {
    
    padding: 10,
    margin: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 20,
    alignItems: 'center'

  },
  carlosText: {
    fontSize: 22,
    color: '#FB4b57',
    fontWeight: 'bold',
    marginTop: 20
  }
})



