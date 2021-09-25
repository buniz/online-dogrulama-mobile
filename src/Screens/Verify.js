import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {useAPI} from '../utils/useApi';
import Loader from '../Components/Loader';

const defaultData = {
  activeIndex: 0,
  total: 0,
  questions: [],
  documentId: '',
};

function VerifyScreen({navigation}) {
  const {post, get} = useAPI();
  const route = useRoute();
  const params = route.params;
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState(null);

  const [data, setData] = useState(defaultData);
  useEffect(() => {
    if (params?.data?.length) {
      setData({
        activeIndex: 0,
        questions: params.data,
        total: params.data.length,
        documentId: params.documentId,
      });
    }
  }, [params?.data]);

  const getQuestion = () => data.questions[data.activeIndex];

  useEffect(() => {
    if (data.questions.length) {
      const currentQuestion = getQuestion();
      if (currentQuestion && currentQuestion?.itemId) {
        setLoading(true);
        get({
          endpoint: `documentItems/getById/${currentQuestion?.itemId}`,
        }).then(response => {
          if (response?.status) {
            setQuestion({...currentQuestion, ...response.item});
          }
        });
      }
    }
  }, [data.activeIndex, data.questions.length]);

  useEffect(() => {
    if (question?.itemId) {
      setLoading(false);
    }
  }, [question?.itemId]);

  const handleSubmitQuestion = () => {
    setLoading(true);

    post({
      endpoint: `filledDocuments/${data.documentId}/approve/${question.itemId}`,
      body: {
        correct: question.correct,
        correctValue: question.correct ? question.value : question.correctValue,
        logBookError: question.logBookError,
        wrongInformation: question.wrongInformation,
        pollsterBug: question.pollsterBug,
        other: question.other,
      },
    }).then(response => {
      if (response?.status) {
        const childs = response.childItems.filter(c => {
          return c.section.startsWith(question.section);
        });
        const lastChild = childs[childs.length - 1];
        const lastChildIndex = response.document.data.findIndex(
          i => i.itemId === lastChild?._id,
        );
        const newActiveIndex =
          question.correct && lastChildIndex !== -1
            ? lastChildIndex + 1
            : data.activeIndex + 1;

        if (newActiveIndex < data.questions.length) {
          setData({
            ...data,
            questions: response.document.data,
            activeIndex: newActiveIndex,
          });
        } else {
          Alert.alert('Tebrikler', 'Anket Tamamlandı', [
            {
              text: 'Ana Sayfaya Dön',
              onPress: () => {
                setData(defaultData);
                navigation.navigate('Home');
              },
            },
          ]);
        }
      }
    });
  };

  const isNextEnabled = () => {
    return (
      question?.approved &&
      (question.correct ||
        (!question.correct &&
          question.correctValue &&
          (question.wrongInformation ||
            question.other ||
            question.pollsterBug ||
            question.logBookError)))
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{padding: 20}}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: 60,
            alignItems: 'center',
          }}
          onPress={() => {
            setData(defaultData);
            navigation.navigate('Home');
          }}>
          <Text>Geri</Text>
        </TouchableOpacity>
        {loading ? <Loader /> : null}
        <View
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <TouchableOpacity
            style={{width: 30, height: 30}}
            onPress={() => {
              if (data.activeIndex >= 1) {
                setData({...data, activeIndex: data.activeIndex - 1});
              }
            }}>
            <Text style={{fontSize: 20}}>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{width: 80, height: 30}}>
            <Text style={{fontSize: 20}}>
              {data.activeIndex + 1} / {data.total}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{width: 30, height: 30}}
            onPress={() => {
              if (question.approved) {
                setData({...data, activeIndex: data.activeIndex + 1});
              }
            }}>
            <Text style={{fontSize: 20}}>{'>'}</Text>
          </TouchableOpacity>
        </View>
        {question ? (
          <View style={{justifyContent: 'center', marginTop: 50}}>
            {/* <View>
            <Text style={styles.title}>Id:</Text>
            <Text style={styles.content}>{question.itemId}</Text>
          </View>*/}
            <View>
              <Text style={styles.title}>Code:</Text>
              <Text style={styles.content}>{question.code}</Text>
            </View>
            <View>
              <Text style={styles.title}>Soru:</Text>
              <Text style={styles.content}>{question.key}</Text>
            </View>
            {question?.description ? (
              <View>
                <Text style={styles.title}>Açıklama:</Text>
                <Text style={styles.content}>{question.description}</Text>
              </View>
            ) : null}
            <View>
              <Text style={styles.title}>Cevap:</Text>
              <Text style={styles.content}>{question.value}</Text>
            </View>
            {question?.unit ? (
              <View>
                <Text style={styles.title}>Birim:</Text>
                <Text style={styles.content}>{question.unit}</Text>
              </View>
            ) : null}
            <View style={styles.btnCnt}>
              <TouchableOpacity
                style={{...styles.btn, backgroundColor: '#90be6d'}}
                onPress={() => {
                  setQuestion({
                    ...question,
                    correct: true,
                    approved: true,
                    correctValue: '',
                  });
                }}>
                <Text style={styles.btnText}>Doğru</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{...styles.btn, backgroundColor: '#ffb703'}}
                onPress={() =>
                  setQuestion({...question, correct: false, approved: true})
                }>
                <Text style={styles.btnText}>Yanlış</Text>
              </TouchableOpacity>
            </View>
            {!question?.correct && question.approved ? (
              <View style={styles.inputCnt}>
                <Text style={styles.incorrectTitle}>
                  Doğru Cevabı{' '}
                  {(question?.options || []).length ? 'Seçiniz' : 'Giriniz'}
                </Text>
                {(question?.options || []).length ? (
                  question.options
                    .filter(o => o !== question.value)
                    .map(option => (
                      <TouchableOpacity
                        key={option}
                        style={styles.optionBtn}
                        onPress={() =>
                          setQuestion({...question, correctValue: option})
                        }>
                        <Text
                          style={{
                            ...styles.optionTxt,
                            color:
                              question.correctValue === option
                                ? '#90be6d'
                                : 'black',
                          }}>
                          - {option}
                        </Text>
                      </TouchableOpacity>
                    ))
                ) : (
                  <TextInput
                    placeholder="Doğru Cevabı Giriniz"
                    style={styles.input}
                    value={question?.correctValue}
                    onChangeText={text =>
                      setQuestion({...question, correctValue: text})
                    }
                  />
                )}
                <Text style={styles.incorrectTitle}>Hata Kaynağı</Text>
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() =>
                    setQuestion({
                      ...question,
                      logBookError: true,
                      wrongInformation: false,
                      pollsterBug: false,
                      other: false,
                    })
                  }>
                  <Text
                    style={{
                      ...styles.optionTxt,
                      color: question.logBookError ? '#90be6d' : 'black',
                    }}>
                    - Kayıt defterinde hata
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() =>
                    setQuestion({
                      ...question,
                      logBookError: false,
                      wrongInformation: true,
                      pollsterBug: false,
                      other: false,
                    })
                  }>
                  <Text
                    style={{
                      ...styles.optionTxt,
                      color: question.wrongInformation ? '#90be6d' : 'black',
                    }}>
                    - Çiftçi yanlış bilgi sağladı
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() =>
                    setQuestion({
                      ...question,
                      logBookError: false,
                      wrongInformation: false,
                      pollsterBug: true,
                      other: false,
                    })
                  }>
                  <Text
                    style={{
                      ...styles.optionTxt,
                      color: question.pollsterBug ? '#90be6d' : 'black',
                    }}>
                    - VT veriyi yanlış girdi
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionBtn}
                  onPress={() =>
                    setQuestion({
                      ...question,
                      logBookError: false,
                      wrongInformation: false,
                      pollsterBug: false,
                      other: true,
                    })
                  }>
                  <Text
                    style={{
                      ...styles.optionTxt,
                      color: question.other ? '#90be6d' : 'black',
                      marginBottom: 10,
                    }}>
                    - Diğer
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
            {isNextEnabled() ? (
              <TouchableOpacity
                style={styles.next}
                onPress={handleSubmitQuestion}>
                <Text style={styles.nextTxt}>
                  {data.activeIndex === data.questions.length
                    ? 'Tamamla'
                    : 'Sonraki Soru'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#219ebc',
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
    borderRadius: 10,
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
    marginBottom: 10,
    borderRadius: 10,
    borderColor: '#dadae8',
    backgroundColor: 'white',
  },
  next: {
    width: '100%',
    height: 50,
    marginTop: 30,
    marginBottom: 30,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#219ebc',
    backgroundColor: '#219ebc',
    borderRadius: 10,
  },
  optionBtn: {
    marginBottom: 10,
  },
  nextTxt: {
    fontSize: 18,
    color: 'white',
  },
  optionTxt: {
    fontSize: 16,
  },
  incorrectTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#219ebc',
    marginLeft: 3,
    fontWeight: 'bold',
  },
});

export default VerifyScreen;
