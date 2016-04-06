import React, {
  View,
  Text,
  Component,
  TextInput,
  StyleSheet,
  TouchableHighlight,
  ScrollView
} from 'react-native'

import Realm from 'realm'
import _ from 'lodash'
let realmId = 0

let realm = new Realm({
  schema: [{name: 'Favs', primaryKey: 'id', properties: {name: 'string', id: 'int'}}]
})

class App extends Component {

  constructor () {
    super()
    this.state = {
      input: '',
      favs: {}
    }
  }

  componentDidMount () {
    let favs = realm.objects('Favs')
    this.setState({
    	favs: favs
    })
  }

  _closeModal () {
    this.props.navigator.pop()
  }

  _updateInput (input) {
    this.setState({ input })
  }

  _addItem () {
    if (this.state.input === '') return
    realm.write(() => {
      realm.create('Favs', { name: this.state.input, id: realmId })
    })
    realmId++
    this.setState({ input: '' })
  }

  _deleteItem (i) {
    let itemToDelete = _.filter(this.state.favs, (f) => {
      return f.id === i
    })
    realm.write(() => {
      realm.delete(itemToDelete[0])
    })
    let favs = realm.objects('Favs')
    this.setState({
      favs: favs
    })
  }

  _viewImages (category) {
    this.props.navigator.push({
      type: 'Modal',
      name: 'ViewImages',
      passProps: {
        closeModal: this._closeModal,
        category
      }
    })
  }

  render () {
    let favs
    favs = _.map(this.state.favs, (f, i) => {
      return <View key={i}>
        <TouchableHighlight onPress={() => this._viewImages(f.name)} underlayColor='transparent' style={style.favorite}>
          <Text style={style.favoriteText}>{f.name}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => this._deleteItem(f.id)}>
          <Text>Delete</Text>
        </TouchableHighlight>
      </View>
    })
    return (
      <View style={style.container}>
        <View style={style.headingContainer}>
          <Text style={style.heading}>Welcome to Realm Imgur Viewer</Text>
        </View>
        <ScrollView style={style.mainContainer}>
          <TextInput
            value={this.state.input}
            onChangeText={(text) => this._updateInput(text)}
            style={style.input}
            placeholder='What Do You Like?' />
          <View style={style.buttonContainer}>
            <TouchableHighlight underlayColor='#3f62aa' style={[ style.button ]} onPress={() => this._addItem()}>
              <Text style={style.buttonText}>Add Item</Text>
            </TouchableHighlight>
          </View>
          <View style={style.favContainer}>
            <Text style={style.favorites}>FAVORITES</Text>
            {favs}
          </View>
        </ScrollView>
      </View>
    )
  }
}

const style = StyleSheet.create({
  headingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#ededed'
  },
  heading: {
    fontSize: 20,
    marginTop: 20
  },
  container: {
    flex: 1
  },
  favorite: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 13,
    marginLeft: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    marginBottom: 10,
    borderRadius: 4
  },
  favoriteText: {
    fontSize: 24,
    color: '#9f9f9f'
  },
  input: {
    height: 60,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: '#ededed',
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: '#666666'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  button: {
    marginRight: 20,
    marginTop: 15,
    padding: 15,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3b5998',
    borderRadius: 4
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  favContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ededed'
  },
  favorites: {
    color: '#c9c9c9',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 17
  },
  mainContainer: {
    flex: 1
  }
})

export default App
