<?php
declare(strict_types=1);

date_default_timezone_set('America/Sao_Paulo');

$successRedirect = './contato.html?status=success#diagnostico';
$errorRedirect = './contato.html?status=error#diagnostico';

// Endereco de destino configurado na HostGator para receber os diagnosticos do site.
$to = 'comercial@agenciajv.com';

// Remetente tecnico usado pelo formulario para envio pelo dominio da HostGator.
$from = 'site@agenciajv.com';

$revenueOptions = [
    'ate_20_mil_mes' => 'Ate R$ 20 mil/mes',
    '20_a_50_mil_mes' => 'De R$ 20 mil a R$ 50 mil/mes',
    '50_a_100_mil_mes' => 'De R$ 50 mil a R$ 100 mil/mes',
    '100_a_300_mil_mes' => 'De R$ 100 mil a R$ 300 mil/mes',
    'acima_300_mil_mes' => 'Acima de R$ 300 mil/mes',
    'informar_na_conversa' => 'Prefiro informar na conversa',
];

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    header('Allow: POST');
    exit('Method Not Allowed');
}

function redirect_with_status(string $location): void
{
    header('Location: ' . $location, true, 303);
    exit;
}

function clean_text($value): string
{
    if (!is_string($value)) {
        return '';
    }

    $value = trim($value);
    $value = strip_tags($value);
    $value = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value) ?? '';
    $value = preg_replace('/\s{2,}/u', ' ', $value) ?? '';

    return trim($value);
}

function text_length(string $value): int
{
    if (function_exists('mb_strlen')) {
        return mb_strlen($value, 'UTF-8');
    }

    return strlen($value);
}

function has_header_injection(string $value): bool
{
    return preg_match('/[\r\n]/', $value) === 1;
}

function normalize_digits(string $value): string
{
    return preg_replace('/\D+/', '', $value) ?? '';
}

function is_valid_cnpj(string $cnpj): bool
{
    if (strlen($cnpj) !== 14) {
        return false;
    }

    if (preg_match('/^(\d)\1{13}$/', $cnpj) === 1) {
        return false;
    }

    for ($length = 12; $length < 14; $length++) {
        $sum = 0;
        $multiplier = $length - 7;

        for ($index = 0; $index < $length; $index++) {
            $sum += (int) $cnpj[$index] * $multiplier;
            $multiplier--;

            if ($multiplier < 2) {
                $multiplier = 9;
            }
        }

        $remainder = $sum % 11;
        $digit = $remainder < 2 ? 0 : 11 - $remainder;

        if ((int) $cnpj[$length] !== $digit) {
            return false;
        }
    }

    return true;
}

function format_cnpj(string $cnpj): string
{
    if (strlen($cnpj) !== 14) {
        return $cnpj;
    }

    return substr($cnpj, 0, 2) . '.' .
        substr($cnpj, 2, 3) . '.' .
        substr($cnpj, 5, 3) . '/' .
        substr($cnpj, 8, 4) . '-' .
        substr($cnpj, 12, 2);
}

$companyName = clean_text($_POST['company_name'] ?? '');
$companyCnpjInput = clean_text($_POST['company_cnpj'] ?? '');
$companyEmail = clean_text($_POST['company_email'] ?? '');
$companyPhoneInput = clean_text($_POST['company_phone'] ?? '');
$revenueBase = clean_text($_POST['revenue_base'] ?? '');
$honeypot = clean_text($_POST['company_site'] ?? '');

if ($honeypot !== '') {
    redirect_with_status($successRedirect);
}

if (
    $companyName === '' ||
    $companyCnpjInput === '' ||
    $companyEmail === '' ||
    $companyPhoneInput === '' ||
    $revenueBase === ''
) {
    redirect_with_status($errorRedirect);
}

if (
    text_length($companyName) > 120 ||
    text_length($companyCnpjInput) > 18 ||
    text_length($companyEmail) > 160 ||
    text_length($companyPhoneInput) > 20
) {
    redirect_with_status($errorRedirect);
}

if (
    has_header_injection($companyName) ||
    has_header_injection($companyEmail)
) {
    redirect_with_status($errorRedirect);
}

$companyCnpj = normalize_digits($companyCnpjInput);
$companyPhone = normalize_digits($companyPhoneInput);

if (!is_valid_cnpj($companyCnpj)) {
    redirect_with_status($errorRedirect);
}

$validatedEmail = filter_var($companyEmail, FILTER_VALIDATE_EMAIL);

if ($validatedEmail === false || has_header_injection($validatedEmail)) {
    redirect_with_status($errorRedirect);
}

if (strlen($companyPhone) < 10 || strlen($companyPhone) > 13) {
    redirect_with_status($errorRedirect);
}

if (!array_key_exists($revenueBase, $revenueOptions)) {
    redirect_with_status($errorRedirect);
}

$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '';
$ipAddress = filter_var($ipAddress, FILTER_VALIDATE_IP) ? $ipAddress : 'Nao informado';

$subject = 'Novo diagnostico solicitado - JV Digital';
$messageLines = [
    'Novo diagnostico solicitado pelo site JV Digital',
    '',
    'Nome da empresa: ' . $companyName,
    'CNPJ: ' . format_cnpj($companyCnpj),
    'E-mail: ' . $validatedEmail,
    'Telefone: ' . $companyPhoneInput,
    'Faturamento base: ' . $revenueOptions[$revenueBase],
    'Data/hora: ' . date('d/m/Y H:i:s'),
    'IP: ' . $ipAddress,
];
$message = implode("\r\n", $messageLines);

$headers = [
    'From: JV Digital Site <' . $from . '>',
    'Reply-To: ' . $validatedEmail,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
];

// Mantido com mail() para a primeira publicacao em hospedagem compartilhada.
// Se a entregabilidade precisar melhorar, troque esta chamada por SMTP autenticado server-side.
$sent = @mail($to, $subject, $message, implode("\r\n", $headers));

if (!$sent) {
    redirect_with_status($errorRedirect);
}

redirect_with_status($successRedirect);
