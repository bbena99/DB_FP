import { Injectable } from '@angular/core';
import { Assignment } from '../models/assignment';
import { Constants } from '../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private URL : string = Constants.API_VERSION
  private asignArray : Assignment[] = []
  constructor() { }

}
