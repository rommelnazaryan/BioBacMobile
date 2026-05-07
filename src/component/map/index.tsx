import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, BackHandler, StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { Colors } from '@/theme';
import Botton from '@/component/button';
import { ensureLocationPermission, getSafeCurrentLocation } from '@/component/getLocation';
import { FontAwesome } from '../icons/VectorIcon';
import ActivityIndicator from '../ActivityIndicator';
import { deviceHeight } from '@/helper/Dimensions';
import { t } from '@/locales';
type Coords = { latitude: number; longitude: number; accuracy?: number };
type MapScreenProps = {
  onSubmit?: (latitude: number, longitude: number) => void;
  onCancel: () => void;
  visibleButton?: boolean;
  latitude?: number | null;
  longitude?: number | null;
};

const DEFAULT_REGION: Region = {
  latitude: 37.78825,
  longitude: -122.4324,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const getRegion = (coordinate: Coords): Region => ({
  latitude: coordinate.latitude,
  longitude: coordinate.longitude,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
});

const isValidCoordinate = (latitude?: number | null, longitude?: number | null) =>
  typeof latitude === 'number' &&
  typeof longitude === 'number' &&
  Number.isFinite(latitude) &&
  Number.isFinite(longitude) &&
  latitude >= -90 &&
  latitude <= 90 &&
  longitude >= -180 &&
  longitude <= 180;

export default function MapScreen({
  onSubmit,
  onCancel,
  visibleButton = true,
  latitude,
  longitude,
}: MapScreenProps) {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<Coords | null>(null);
  const destinationCoords = useMemo<Coords | null>(() => {
    if (!isValidCoordinate(latitude, longitude)) {
      return null;
    }

    return {
      latitude: latitude as number,
      longitude: longitude as number,
    };
  }, [latitude, longitude]);


  useEffect(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        onCancel();
        return true;
      });  
      return () => {
        subscription.remove();
      };
    }, [onCancel]);

  useEffect(() => {
    if (!destinationCoords) {
      return;
    }

    mapRef.current?.animateToRegion(getRegion(destinationCoords), 500);
  }, [destinationCoords]);

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
          setUserCoords(c);
          mapRef.current?.animateToRegion(getRegion(c), 500);
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
    if (userCoords === null) {
      Alert.alert(t('common.pleaseGetLocation'), t('common.pleaseGetLocationToSubmit'));
    } else {
      onSubmit?.(userCoords.latitude, userCoords.longitude);
    }
  }, [userCoords, onSubmit]);

  return (
    <View style={styles.container}>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={destinationCoords ? getRegion(destinationCoords) : DEFAULT_REGION}
        showsUserLocation={false}
        showsMyLocationButton={true}
      >
        {destinationCoords && (
          <Marker
            coordinate={destinationCoords}
            pinColor={Colors.red}
            title="Selected location"
          />
        )}
        {userCoords && (
          <Marker
            coordinate={userCoords}
            pinColor={Colors.blue}
            title="My location"
          />
        )}
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
      {visibleButton &&
        <View style={styles.buttonContainer}>
          <Botton title={t('common.cancel')} onHandler={onCancel} disabled={loading} style={[styles.button, styles.cancelButton]} textStyle={styles.cancelButtonText} />
          <Botton title={t('common.submit')} onHandler={onSubmitHandler} disabled={loading} style={styles.button} />
        </View>}
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

