import React, {
  View,
  Text,
  Component,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Image,
  Dimensions
} from 'react-native'

let windowWidth = Dimensions.get('window').width
import API from './api'
import _ from 'lodash'

class ViewImages extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: true,
      images: []
    }
  }

  componentDidMount () {
    setTimeout(() => {
    	API.get(this.props.category)
      .then((response) => {
        this.setState({ images: response, loading: false })
      }, (error) => {
        console.log('error: ', error)
      })
    }, 700)
  }

  render () {
    let { loading, images } = this.state

    if (loading) {
      images = (
        <View style={style.loadingContainer}>
          <Text style={style.loading}>Loading images...</Text>
        </View>)
    }

    if (!loading) {
      images = _.map(this.state.images.data.items, (image, i) => {
        if (image.link.match(/\.(jpg|png|gif)/g)) {
          return (
            <View key={i}>
              <Image source={{ uri: image.link }} style={{width: windowWidth, height: windowWidth}} />
            </View>)
        }
      })
    }

    return (
      <View style={{flex: 1}}>
        <TouchableHighlight underlayColor='transparent' onPress={this.props.closeModal.bind(this)} style={style.closeButton}>
          <Text style={style.closeButtonText}>CLOSE</Text>
        </TouchableHighlight>
        <ScrollView style={{flex: 1}}>
          {images}
        </ScrollView>
      </View>
		)
  }
}

const style = StyleSheet.create({
  closeButton: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#e6e6e6',
    borderBottomWidth: 1
  },
  closeButtonText: {
    fontSize: 16,
    color: '#afafaf',
    marginTop: 10
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 160
  },
  loading: {
    fontSize: 22,
    color: '#7f7f7f'
  }
})

export default ViewImages
