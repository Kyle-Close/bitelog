'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const dotenv_1 = __importDefault(require('dotenv'));
dotenv_1.default.config();
const admin = __importStar(require('firebase-admin'));
const express_1 = __importDefault(require('express'));
const cors_1 = __importDefault(require('cors'));
const body_parser_1 = __importDefault(require('body-parser'));
const routes_1 = __importDefault(require('./routes'));

const associations_1 = __importDefault(require('./models/associations'));
admin.initializeApp({
  credential: admin.credential.cert(bitelog_firebase_json_1.default),
});
(0, associations_1.default)(); // Setup all the necessary SQL associations
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)({ origin: true }));
app.use(body_parser_1.default.json());
app.use('/', routes_1.default);
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
