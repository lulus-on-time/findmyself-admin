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
