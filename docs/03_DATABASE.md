# Database PyroRescue

Gunakan MySQL atau MariaDB. phpMyAdmin hanya digunakan untuk melihat dan mengelola database.

Nama database yang disarankan:

```text
pyrorescue_db
```

## Tabel utama

```text
users
levels
challenges
user_level_progress
challenge_attempts
```

## `levels`

Kolom:

```text
id
level_number
title
material
learning_objective
is_active
created_at
updated_at
```

Contoh data:

```text
1 | Tepi Sungai Terbakar | variable
2 | Hutan Gambut Berasap | loop
3 | Suaka Bekantan | if_else
```

## `challenges`

Kolom:

```text
id
level_id
order_number
title
instruction
concept
starter_code
expected_data
hint_1
hint_2
created_at
updated_at
```

`expected_data` memakai JSON sederhana.

Level 1:

```json
{
  "water": 3,
  "must_use_variable": true
}
```

Level 2:

```json
{
  "spray_count": 3,
  "must_use_loop": true
}
```

Level 3:

```json
{
  "condition": "api_padam",
  "must_use_if": true,
  "must_use_else": true
}
```

## `user_level_progress`

Kolom:

```text
id
user_id
level_id
status
completed_at
completed_challenges
level3_checkpoint (JSON nullable)
stars
score
created_at
updated_at
```

Status:

```text
locked
unlocked
completed
```

`completed_challenges` menyimpan tiga challenge dan tahap evaluasi secara berurutan.
`score` menyimpan nilai terbaik (0–100) saat evaluasi mencapai FINISH.
`stars` bernilai 1 untuk 70–84%, 2 untuk 85–99%, dan 3 untuk 100%.
Nilai hanya menentukan kualitas badge: Tuntas di bawah 70%, Perunggu 70–84%,
Perak 85–99%, dan Emas 100%. Seluruh challenge dan evaluasi yang selesai membuka
level berikutnya tanpa syarat bintang. Hasil terbaik tidak turun saat level diulang.
Pencapaian pada profil pemain dihitung dari progres tersebut. Mode tamu tidak menulis progres.

## `challenge_attempts`

Digunakan untuk assessment sederhana.

Kolom:

```text
id
user_id
challenge_id
submitted_code
syntax_valid
concept_valid
mission_success
created_at
```

## Relasi

```text
Level hasMany Challenge
Level hasMany UserLevelProgress

Challenge belongsTo Level

UserLevelProgress belongsTo User
UserLevelProgress belongsTo Level

ChallengeAttempt belongsTo User
ChallengeAttempt belongsTo Challenge
```

## Kenapa sederhana?

Karena game hanya memiliki tiga level. Jangan membuat inventory, shop, leaderboard, atau sistem achievement kompleks jika belum diperlukan.

Level 3 menyimpan checkpoint submisi pada level3_checkpoint: challenge, step, posisi, air, semprotan tiap api, satwa di pos/mengikuti, kondisi jalur, evaluasi, percobaan, dan hint. Snapshot challenge lama diabaikan saat resume.
