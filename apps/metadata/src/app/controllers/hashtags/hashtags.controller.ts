/*
 * Copyright (c) 2021, Castcle and/or its affiliates. All rights reserved.
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License
 * version 3 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 3 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 * Please contact Castcle, 22 Phet Kasem 47/2 Alley, Bang Khae, Bangkok,
 * Thailand 10160, or visit www.castcle.com if you need additional information
 * or have any questions.
 */

import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import {
  CredentialInterceptor,
  CredentialRequest
} from '@castcle-api/utils/interceptors';
import { HashtagService } from '@castcle-api/database';
import { ApiBearerAuth, ApiHeader, ApiOkResponse } from '@nestjs/swagger';
import { HashtagsResponse } from '@castcle-api/database/dtos';

@Controller()
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @ApiBearerAuth()
  @ApiHeader({
    name: 'Accept-Language',
    description: 'Device prefered Language',
    example: 'th',
    required: true
  })
  @ApiOkResponse({
    type: HashtagsResponse
  })
  @UseInterceptors(CredentialInterceptor)
  @Get('hashtags')
  async getHashtags(@Req() req: CredentialRequest): Promise<HashtagsResponse> {
    const hashtags = await this.hashtagService.getAll();

    const payload = hashtags.map((hashtag) => {
      return hashtag.toPagePayload(req.$language);
    });

    return {
      message: 'success message',
      payload: payload
    };
  }
}
