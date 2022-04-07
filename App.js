import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location';

const { height, width } = Dimensions.get('window')

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  state = {
    places: [
      {
        id: 1,
        title: 'Sua localização',
        description: 'Você está neste ponto do mapa',
        latitude: -27.2106710,
        longitude: -49.6362700,
      },
      {
        id: 2,
        title: 'Restaurante Fogo na Brasa',
        description: 'Restaurante self service direto do fogão a lenha',
        latitude: -27.2806710,
        longitude: -49.6262700,
      },
      {
        id: 3,
        title: 'Drogaria Saúde+',
        description: 'Todas as variedades de remédios',
        latitude: -27.2906710,
        longitude: -49.6162700,
      },
      {
        id: 4,
        title: 'Hotel City',
        description: 'O hotel que tem o conforto de sua casa',
        latitude: -27.2706710,
        longitude: -49.6462700,
      }
    ]
  }

  const { latitude,longitude } = this.state.places[0];

  return (
      <View style={styles.container}>
        <MapView 
          ref={map => this.mapView = map}
          style={styles.mapView}
          showsPointsOfInterest={false}
          showsBuildings={false}
          region={
            !location ? {
              latitude: 0, 
              longitude: 0, 
              latitudeDelta: 0.005, 
              longitudeDelta: 0.005
            } : {
              latitude,
              longitude, 
              latitudeDelta: 0.005, 
              longitudeDelta: 0.005
            }
          }
        >
          { this.state.places.map(place => (
            <Marker 
            key={place.id}
            ref={mark => place.mark = mark}
            title={place.title}
            description={place.description}
            coordinate={
              !location ? {
                latitude: 0, 
                longitude: 0, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005
              } : {
                latitude: place.latitude,
                longitude: place.longitude, 
                latitudeDelta: 0.005, 
                longitudeDelta: 0.005
              }
            }
          />
          )) }
          
        </MapView>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.placesContainer} 
          pagingEnabled 
          onMomentumScrollEnd={e => {
            const scrolled = e.nativeEvent.contentOffset.x;
            const place = (scrolled > 0)
              ? scrolled / Dimensions.get('window').width
              : 0;

            const { latitude, longitude, mark } = this.state.places[place];
            let region = {
              latitude: latitude,
              longitude: longitude
            }
            this.mapView.animateCamera({center: region})

            setTimeout(() => {
              mark.showCallout();
            }, 1000)
          }}
        >
          { this.state.places.map(place => (
            <View key={place.id} >
              <Text style={styles.place}>{place.title}</Text>
              <Text style={styles.place}>{place.description}</Text>
            </View>
          )) }
          
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end'
  },
  mapView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  placesContainer: {
    width: '100%',
    maxHeight: 200
  },
  place: {
    width: width -40,
    maxHeight: 200,
    backgroundColor: '#FFF',
    marginHorizontal: 20
  }
});
