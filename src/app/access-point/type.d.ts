interface Floor {
  id: number;
  name: string;
  level: number;
  apTotal: number;
}

export interface AccessPointDataType {
  key: number;
  floor: Floor;
  locationName: string;
}

export interface ApDetailDataType {
  key: number;
  apInfo: {
    id: number;
    locationName: string;
    bssidTotal: number;
  };
  ssid: string;
  bssid: string;
}
