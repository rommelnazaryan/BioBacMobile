import React, { useCallback, useRef, useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { Colors } from '@/theme';
import Botton from '@/component/button';
import { ensureLocationPermission, getSafeCurrentLocation } from '@/component/getLocation';
import { FontAwesome } from '../icons/VectorIcon';
import ActivityIndicator from '../ActivityIndicator';
import { deviceHeight } from '@/helper/Dimensions';
import { t } from '@/locales';
type Coords = { latitude: number; longitude: number; accuracy?: number };

const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function MapScreen({ onSubmit, onCancel }: { onSubmit: (latitude: number, longitude: number) => void, onCancel: () => void }) {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<Coords | null>(null);



  const locateMe = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    try {
      const granted = await ensureLocationPermission();
      if (!granted) {
        Alert.alert(t('common.permissionRequired'));
        setLoading(false);
        return;
      }

      getSafeCurrentLocation(
        c => {
          setCoords(c);
          mapRef.current?.animateToRegion(
            {
              latitude: c.latitude,
              longitude: c.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            500,
          );
          setLoading(false);
        },
        () => {
          Alert.alert(t('common.failedToGetLocation'));
          setLoading(false);
        },
      );
    } catch (e) {
      Alert.alert((e as Error)?.message ?? t('common.failedToGetLocation'));
      setLoading(false);
    }
  }, [loading]);


  const onSubmitHandler = useCallback(() => {
    if (coords === null) {
        Alert.alert(t('common.pleaseGetLocation'), t('common.pleaseGetLocationToSubmit'));
    }else{
      onSubmit(coords.latitude, coords.longitude);
    }
  }, [coords, onSubmit]);

  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        showsUserLocation={!!coords}
        showsMyLocationButton={true}
      >
        {coords && <Marker coordinate={{ latitude: coords.latitude, longitude: coords.longitude }} />}
      </MapView>
      <TouchableOpacity
        onPress={locateMe}
        style={styles.getlocationButton}>
        <FontAwesome name="location-arrow" size={24} color={Colors.black} />
      </TouchableOpacity>
      {loading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator />
      </View>
      )}
      <View style={styles.buttonContainer}>
      <Botton title={t('common.cancel')} onHandler={onCancel}  disabled={loading} style={[styles.button, styles.cancelButton]} textStyle={styles.cancelButtonText}/>
        <Botton title={t('common.submit')} onHandler={onSubmitHandler}  disabled={loading} style={styles.button} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.white,
  },
  mapContainer: {
    backgroundColor: Colors.red_100,
    flex: 1,
  },
  map: {
    width: '100%',
    height: '90%',
    position: 'relative',
  },

  loadingOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: deviceHeight * 0.04,
    left: '45%',
  },
  getlocationButton: {
    width: 60, height: 60,
    borderRadius: 60,
    backgroundColor: Colors.white,
    borderColor: Colors.blue,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 120,
    right: 20,
  },
  buttonContainer: {
    width: '90%',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '5%',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  cancelButtonText: {
    color: Colors.red,
  },
  button: {
    width: '45%',
  },
});

