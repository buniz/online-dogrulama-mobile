import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useAPI} from '../utils/useApi';

function VerifyScreen() {
  const {post} = useAPI();
  const route = useRoute();
  const params = route.params;
  const [question, setQuestion] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [data, setData] = useState({total: 0, questions: [], documentId: ''});
  useEffect(() => {
    setData({
      questions: params.data,
      total: params.data.length,
      documentId: params.documentId,
    });
  }, [params?.data]);

  const getQuestion = () => data.questions[activeIndex];
  useEffect(() => {
    if (data.questions.length) {
      setQuestion(getQuestion());
    }
  }, [activeIndex, data.questions.length]);

  const handleSubmitQuestion = () => {
    post({
      endpoint: `documents/${data.documentId}/approve/${question._id}`,
      body: {
        correct: question.correct,
        correctValue: question.correct ? question.value : question.correctValue,
      },
    }).then(response => {
      if (response?.status) {
        setActiveIndex(activeIndex + 1);
      }
    });
  };
  const isNextEnabled = () => {
    return (
      question?.approved &&
      (question.correct || (!question.correct && question.correctValue))
    );
  };
  return (
    <ScrollView style={{padding: 20}}>
      <View
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity style={{width: 30, height: 30}}>
          <Text style={{fontSize: 20}}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: 80, height: 30}}>
          <Text style={{fontSize: 20}}>
            {activeIndex + 1} / {data.total}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{width: 30, height: 30}}>
          <Text style={{fontSize: 20}}>{'>'}</Text>
        </TouchableOpacity>
      </View>
      {question ? (
        <View style={{justifyContent: 'center', marginTop: 200}}>
          <View>
            <Text style={styles.title}>Soru:</Text>
            <Text style={styles.content}>{question.key}</Text>
          </View>
          <View>
            <Text style={styles.title}>Cevap:</Text>
            <Text style={styles.content}>{question.value}</Text>
          </View>
          <View style={styles.btnCnt}>
            <TouchableOpacity
              style={{...styles.btn, backgroundColor: '#7DE24E'}}
              onPress={() =>
                setQuestion({...question, correct: true, approved: true})
              }>
              <Text style={styles.btnText}>Doğru</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{...styles.btn, backgroundColor: 'red'}}
              onPress={() =>
                setQuestion({...question, correct: false, approved: true})
              }>
              <Text style={styles.btnText}>Yanlış</Text>
            </TouchableOpacity>
          </View>
          {!question?.correct && question.approved ? (
            <View style={styles.inputCnt}>
              <TextInput
                placeholder="Doğru Cevabı Giriniz"
                style={styles.input}
                value={question?.correctValue}
                onChangeText={text =>
                  setQuestion({...question, correctValue: text})
                }
              />
            </View>
          ) : null}
          {isNextEnabled() ? (
            <TouchableOpacity
              style={styles.next}
              onPress={handleSubmitQuestion}>
              <Text>Sonraki Soru</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'blue',
  },
  content: {
    fontSize: 18,
  },
  btnCnt: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  btn: {
    width: '45%',
    height: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  inputCnt: {
    marginTop: 20,
    padding: 10,
  },
  input: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  next: {
    width: '100%',
    height: 50,
    marginTop: 100,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
  },
});

export default VerifyScreen;
