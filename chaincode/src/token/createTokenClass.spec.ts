/*
 * Copyright (c) Gala Games Inc. All rights reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { CreateTokenClassDto, GalaChainResponse, createValidDTO } from "@lfginc/gala-api";
import { currency, fixture, users, writesMap } from "@lfginc/gala-test";
import BigNumber from "bignumber.js";

import GalaChainTokenContract from "../__test__/GalaChainTokenContract";

it("should CreateTokenClass", async () => {
  // Given
  const { ctx, contract, writes } = fixture(GalaChainTokenContract);

  const tokenClassKey = currency.tokenClassKey();

  const dto: CreateTokenClassDto = await createValidDTO(CreateTokenClassDto, {
    tokenClass: tokenClassKey,
    maxCapacity: new BigNumber("1000000000"),
    maxSupply: new BigNumber("10000000000"),
    name: "TESTCURRENCY",
    description: "A mock currency for automated tests.",
    decimals: 4,
    network: "GC",
    totalMintAllowance: new BigNumber("100000000"),
    image: "http://app.gala.games/some-test-image-url",
    symbol: "AUTOTESTCOIN",
    isNonFungible: false,
    authorities: [users.testAdminId]
  });

  // When
  const response = await contract.CreateTokenClass(ctx, dto);

  // Then
  expect(response).toEqual(GalaChainResponse.Success(tokenClassKey));

  const expectedInstance = currency.tokenInstance();
  const expectedClass = currency.tokenClass((defaults) => {
    const { tokenClass, ...fromDto } = dto;
    const missingInDto = { contractAddress: undefined, metadataAddress: undefined, rarity: undefined };
    return { ...defaults, ...fromDto, ...missingInDto, ...tokenClass };
  });
  expect(writes).toEqual(writesMap(expectedInstance, expectedClass));
});
