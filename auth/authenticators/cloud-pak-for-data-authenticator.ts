/**
 * Copyright 2019 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Cp4dTokenManager } from '../token-managers';
import { validateInput } from '../utils';
import { BaseOptions, TokenRequestBasedAuthenticator }
  from './token-request-based-authenticator';

/** Configuration options for CloudPakForData authentication. */
export interface Options extends BaseOptions {
  /** The username used to obtain a bearer token. */
  username: string;
  /** The password used to obtain a bearer token. */
  password: string;
  /** The URL representing the Cloud Pak for Data token service endpoint. */
  url: string;
}

/**
 * The [[CloudPakForDataAuthenticator]] will use the user-supplied url, username and password values to obtain
 * a bearer token from a token server.  When the bearer token expires, a new token is obtained from the token server.
 *
 * The bearer token will be sent as an Authorization header in the form:
 *
 *      Authorization: Bearer <bearer-token>
 */
export class CloudPakForDataAuthenticator extends TokenRequestBasedAuthenticator
{
  protected requiredOptions = ['username', 'password', 'url'];
  protected tokenManager: Cp4dTokenManager;
  private username: string;
  private password: string;
  /**
   * Create a new [[CloudPakForDataAuthenticator]] instance.
   *
   * @param {object} options Configuration options for CloudPakForData authentication.
   * @param {string} options.url For HTTP token requests.
   * @param {string} options.username The username used to obtain a bearer token.
   * @param {string} options.password The password used to obtain a bearer token.
   * @param {boolean} [options.disableSslVerification] A flag that indicates
   *   whether verification of the token server's SSL certificate should be
   *   disabled or not
   * @param {object<string, string>} [options.headers] to be sent with every.
   * @throws `Error` The username, password, and/or url are not valid, or unspecified, for Cloud Pak For Data token
   *   requests.
   */
  constructor(options: Options) {
    super(options);

    validateInput(options, this.requiredOptions);

    this.username = options.username;
    this.password = options.password;

    // the param names are shared between the authenticator and the token
    // manager so we can just pass along the options object
    this.tokenManager = new Cp4dTokenManager(options);
  }
}
