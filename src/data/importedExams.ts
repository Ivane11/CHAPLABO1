import { ExamDefinition } from '../types';

export const IMPORTED_EXAMS: ExamDefinition[] = [
  {
    "id": "EXM-HORM-TSH",
    "code": "TSH",
    "name": "Thyréostimuline (TSH)",
    "category": "Hormonologie",
    "sampleTypeDefault": "Sérum",
    "price": 8000,
    "active": true,
    "sections": [
      {
        "title": "Paramètres",
        "parameters": [
          {
            "id": "HORM_TSH",
            "name": "TSH us",
            "unit": "mUI/L",
            "type": "number",
            "ageReferences": [
              {
                "min": 0.27,
                "max": 4.2
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "EXM-HORM-VITD",
    "code": "VITD",
    "name": "Vitamine D (25-OH)",
    "category": "Hormonologie",
    "sampleTypeDefault": "Sérum",
    "price": 15000,
    "active": true,
    "sections": [
      {
        "title": "Paramètres",
        "parameters": [
          {
            "id": "HORM_VITD",
            "name": "Vitamine D Totale",
            "unit": "ng/mL",
            "type": "number",
            "ageReferences": [
              {
                "min": 30,
                "max": 100
              }
            ]
          }
        ]
      }
    ]
  }
];
